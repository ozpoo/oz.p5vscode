const vscode = require('vscode')
const path = require('path')
const fs = require('fs')
const fetch = require('node-fetch')
const { readFile, writeFile, pipeline } = require('fs/promises')

async function installLibrary(url) {
	const workspacePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath

	if (!workspacePath ||
		!fs.existsSync(path.join(workspacePath, 'index.html')) ||
		!fs.existsSync(path.join(workspacePath, 'libraries'))) {
		throw new Error('Workspace must include index.html and libraries folder')
	}

	const urls = Array.isArray(url) ? url : [url]

	try {
		for (const libraryUrl of urls) {
			const basename = path.basename(libraryUrl)
			const destPath = path.join(workspacePath, 'libraries', basename)
			const indexPath = path.join(workspacePath, 'index.html')

			if (!fs.existsSync(destPath)) {
				try {
					const response = await fetch(libraryUrl)
					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`)
					}
					await pipeline(
						response.body,
						fs.createWriteStream(destPath)
					)
				} catch (error) {
					throw new Error(`Failed to download library from ${libraryUrl}: ${error.message}`)
				}
			}

			const scriptTag = `<script src='libraries/${basename}'></script>`
			const indexContent = await readFile(indexPath, 'utf-8')

			if (!indexContent.includes(scriptTag)) {
				const updatedContent = indexContent.replace(
					'</head>',
					`  ${scriptTag}\n  </head>`
				)
				await writeFile(indexPath, updatedContent)
			}
		}

		return {
			success: true,
			message: 'Libraries installed successfully'
		}

	} catch (error) {
		return {
			success: false,
			message: error.message
		}
	}
}

module.exports = {
	installLibrary
}
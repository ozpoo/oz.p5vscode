const vscode = require('vscode')

const { writeFile, mkdir } = require('fs/promises')
const { join } = require('path')

const Uri = vscode.Uri

async function copyTemplate(dest) {
	const templateFiles = [
		'index.html',
		'style.css',
		'sketch.js',
		join('libraries', 'p5.min.js'),
		join('libraries', 'p5.sound.min.js'),
	]

	const baseSrc = Uri.joinPath(Uri.file(__dirname), '../template')
	const baseDest = Uri.file(dest)

	try {
		await mkdir(baseDest.fsPath, { recursive: true })
		await mkdir(join(baseDest.fsPath, 'libraries'), { recursive: true })

		await Promise.all(templateFiles.map(async (file) => {
			const src = Uri.joinPath(baseSrc, file)
			const dest = Uri.joinPath(baseDest, file)

			try {
				await vscode.workspace.fs.copy(src, dest, { overwrite: false })
			} catch (error) {
				if (error.code !== 'FileExists') {
					throw error
				}
			}
		}))

		const jsconfig = {
			compilerOptions: { target: 'es2020' },
			include: [
				'*.js',
				'**/*.js',
				Uri.joinPath(Uri.file(__dirname), '../p5types', 'global.d.ts').fsPath,
			],
		}

		const jsconfigPath = Uri.joinPath(baseDest, 'jsconfig.json')
		await writeFile(
			jsconfigPath.fsPath,
			JSON.stringify(jsconfig, null, 2),
			'utf-8'
		)

	} catch (error) {
		console.error('Failed to copy template:', error)
		throw error
	}
}

module.exports = {
	copyTemplate
}
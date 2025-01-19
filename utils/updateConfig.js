const vscode = require('vscode')
const path = require('path')
const fs = require('fs/promises')

async function updateConfig(context) {
	try {
		const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath
		if (!workspacePath) {
			console.log('No workspace found')
			return false
		}

		const jsconfigPath = path.join(workspacePath, 'jsconfig.json')

		try {
			await fs.access(jsconfigPath)
		} catch {
			console.log('No jsconfig.json found')
			return false
		}

		const jsconfigContents = await fs.readFile(jsconfigPath, 'utf-8')

		const extensionName = context.extension.id
		const currentVersion = context.extension.packageJSON.version
		const currentName = `${extensionName}-${currentVersion}`

		const versionPattern = new RegExp(`${extensionName}-\\d+(\\.\\d+)*`, 'g')

		if (!versionPattern.test(jsconfigContents)) {
			console.log('No version pattern found to update')
			return false
		}

		const updatedContents = jsconfigContents.replace(versionPattern, currentName)

		await fs.writeFile(jsconfigPath, updatedContents)

		console.log(`Successfully updated jsconfig.json with version ${currentVersion}`)
		return true

	} catch (error) {
		console.error('Error updating jsconfig.json:', error)
		return false
	}
}

module.exports = {
	updateConfig
}
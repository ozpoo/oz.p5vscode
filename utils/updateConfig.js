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

		// Check if file exists using fs.promises
		try {
			await fs.access(jsconfigPath)
		} catch {
			console.log('No jsconfig.json found')
			return false
		}

		// Read file contents
		const jsconfigContents = await fs.readFile(jsconfigPath, 'utf-8')

		// Construct the version identifier
		const extensionName = context.extension.id
		const currentVersion = context.extension.packageJSON.version
		const currentName = `${extensionName}-${currentVersion}`

		// Create regex pattern for version matching
		const versionPattern = new RegExp(`${extensionName}-\\d+(\\.\\d+)*`, 'g')

		// Check if the version pattern exists and needs updating
		if (!versionPattern.test(jsconfigContents)) {
			console.log('No version pattern found to update')
			return false
		}

		// Update the contents
		const updatedContents = jsconfigContents.replace(versionPattern, currentName)

		// Write the updated contents
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
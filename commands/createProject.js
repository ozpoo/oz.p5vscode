const { Uri, commands, window, env } = require('vscode')
const { copyTemplate } = require('../utils/copyTemplate')

function initializeCreateProject(context) {
	const createProject = commands.registerCommand('extension.createProject', async () => {
		try {
			const [selectedFolder] = await window.showOpenDialog({
				canSelectFiles: false,
				canSelectFolders: true,
				canSelectMany: false,
			})

			if (!selectedFolder) return

			const destinationPath = selectedFolder.path
			await copyTemplate(destinationPath)

			const destinationUri = Uri.file(destinationPath)
			// Open workspace in new window
			// await commands.executeCommand('vscode.openFolder', destinationUri, true)

			// Open sketch file (non-Windows platforms only)
			if (process.platform !== 'win32') {
				const sketchUri = Uri.joinPath(destinationUri, 'sketch.js')
				const sketchVscodeUri = Uri.parse(`vscode://file${sketchUri.path}`)
				await env.openExternal(sketchVscodeUri)
			}
		} catch (error) {
			console.error(error)
		}
	})
	context.subscriptions.push(createProject)
}

module.exports = {
	initializeCreateProject
}
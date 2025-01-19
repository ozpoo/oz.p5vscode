const { Uri, commands, window, env } = require('vscode')
const librariesJson = require('../libraries/libraries.json')

function initializeInstallLibrary(context) {
	const installLibrary = commands.registerCommand('extension.installLibrary', async () => {
		try {
			const libraries = librariesJson.filter((l) => l.install).map((l) => {
				return {
					label: l.name,
					description: l.authors ? l.authors.map((a) => a.name).join(', ') : '',
					detail: l.desc,
					install: l.install,
					url: l.url,
				}
			})
			const result = await window.showQuickPick(libraries, {
				placeHolder: 'Library name',
			})
			if (result) {
				const action = await window.showQuickPick([
					{
						label: 'Install ' + result.label,
						action: 'install',
					},
					{
						label: 'Visit home page',
						action: 'visit',
					}],
					{
						placeHolder: 'Select action',
					})
				if (action) {
					if (action.action === 'install' && result.install) {
						const result = await installP5Library(result.install)
						const messageType = result.success
							? window.showInformationMessage
							: window.showErrorMessage
						messageType(result.message)
					}
					else {
						env.openExternal(Uri.parse(result.url))
					}
				}
			}
		} catch (error) {
			window.showErrorMessage(`Installation failed: ${error.message}`)
		}
	})
	context.subscriptions.push(installLibrary)
}

module.exports = {
	initializeInstallLibrary
}
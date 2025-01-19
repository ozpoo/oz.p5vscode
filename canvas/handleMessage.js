const vscode = require('vscode')
const fs = require('fs')

function handleMessage(message, outputChannel) {
	if (message.type == 'log') {
		switch (message.logType) {
			case 'warn':
				outputChannel.appendLine('⚠️: ' + message.msg)
				return
			case 'error':
				outputChannel.appendLine('🚫: ' + message.msg)
				return
			case 'debug':
				outputChannel.appendLine('❗️: ' + message.msg)
				return
			case 'trace':
				outputChannel.appendLine('🔎: ' + message.msg)
				return
			case 'info':
				outputChannel.appendLine('ℹ️: ' + message.msg)
				return
			case 'log':
				outputChannel.appendLine(message.msg)
				return
		}
	} else if (message.type == 'imageData') {
		if (message.mimeType == 'png') {
			let imageData = message.data.replace(/^data:image\/pngbase64,/, '')
			let options = {
				filters: {
					Images: ['png'],
				},
			}
			vscode.window.showSaveDialog(options).then((result) => {
				if (result) {
					let path = result.fsPath
					fs.writeFile(path, imageData, 'base64', (err) => {
						if (err) {
							vscode.window.showErrorMessage('Error saving the file: ' + err)
						}
						else {
							vscode.window.showInformationMessage('The file has been saved.')
						}
					})
				}
			})
		}
	}
	else if (message.type == 'jsError') {
		outputChannel.appendLine(`🦷: ${message.containedMessage} in Line ${message.containedRawLine - PRECEDING_LINES_IN_SCRIPT_TAG} / Column ${message.containedRawColumn}`)
	}
	else {
		outputChannel.appendLine(`unknown message of type '${message.type}' received`)
	}
}

module.exports = {
	handleMessage
}
const crypto = require('crypto')
const jshint = require('jshint')

const { getWebviewContent } = require('./getWebviewContent')

function updateCode(editor, outputChannel, currentPanel, lastCodeHash, showRulers) {
	if (!editor || !currentPanel) {
		return
	}
	let text = editor.document.getText()
	let hash = crypto.createHash('md5').update(text).digest('hex')
	if (lastCodeHash === hash) {
		return
	}
	lastCodeHash = hash
	let options = {
		esversion: 6
	}
	jshint.JSHINT(text, options)
	if (jshint.JSHINT.errors.length == 0) {
		outputChannel.clear()
		console.log(getWebviewContent(text, currentPanel, editor, showRulers))
		currentPanel.webview.html = getWebviewContent(text, currentPanel, editor, showRulers)
	}
	else {
		let message = '🙊 Errors:\n'
		jshint.JSHINT.errors.forEach((element) => {
			message += `Line ${element.line}, col ${element.character}: ${element.reason}\n`
		})
		outputChannel.clear()
		outputChannel.append(message)
	}
}

module.exports = {
	updateCode
}
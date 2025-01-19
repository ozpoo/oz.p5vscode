const crypto = require('crypto')
const jshint = require('jshint')
const { getWebviewContent } = require('./getWebviewContent')

function updateCode(editor, outputChannel, currentPanel, lastCodeHash) {
	if (!editor || !currentPanel) {
			return;
	}
	let text = editor.document.getText();
	let hash = crypto.createHash("md5").update(text).digest("hex");
	if (lastCodeHash === hash) {
		return;
	}
	lastCodeHash = hash;
	let options = {
		esversion: 6
	};
	jshint.JSHINT(text, options);
	if (jshint.JSHINT.errors.length == 0) {
		outputChannel.clear();
		console.log(getWebviewContent(text, currentPanel))
		console.log(currentPanel.webview.html)
		currentPanel.webview.html = getWebviewContent(text, currentPanel);
	}
	else {
			let message = "🙊 Errors:\n";
			let es6error = false;
			jshint.JSHINT.errors.forEach((element) => {
				message += `Line ${element.line}, col ${element.character}: ${element.reason}\n`;
			});
			outputChannel.clear();
			outputChannel.append(message);
	}
}

module.exports = {
	updateCode
}
const vscode = require('vscode')
const { Uri, workspace, window } = require('vscode')
const fs = require('fs')
const path = require('path')

const PRECEDING_LINES_IN_SCRIPT_TAG = 7

function getWebviewContent(code = "", currentPanel) {
	if (!currentPanel && !window.activeTextEditor) {
		return;
	}

	let extensionPath = currentPanel.webview.asWebviewUri(Uri.file(__dirname));
	let localPath = currentPanel.webview.asWebviewUri(Uri.file(path.dirname(window.activeTextEditor.document.uri.path) + path.sep));

	return `
<!DOCTYPE html>
<html>
	<head>
		<script src="${localPath}assets/p5.js"></script>
		<script src="${extensionPath}/assets/communication.js"></script>
		<script src="${extensionPath}/assets/p5setup.js"></script>
		<script>var p5rulersize = 0</script>` +
	//   <script src="${extensionPath}/assets/ruler.js"></script>
		`<link rel="stylesheet" href="${extensionPath}/assets/p5canvas.css" />
	</head>
	<body>` +
	//   <canvas id="ruler-vertical"></canvas>
		`<div class="flex-col no-padding-no-margin">` +
			// <canvas id="ruler-horizontal"></canvas>
			`<div id="p5canvas"></div>
		</div>
		<script id="code">
			var PRECEDING_LINES_IN_SCRIPT_TAG = ${PRECEDING_LINES_IN_SCRIPT_TAG};
			function runCode() {
				var draw, preload, setup;
				var keyPressed, keyReleased, keyTyped;
				var mousePressed, mouseReleased, mouseClicked, doubleClicked;
				var mouseDragged, mouseMoved, mouseWheel;
				var touchesStarted, touchesMoved, touchesEnded;
				${code}
				window._customPreload = preload;
				window._customSetup = setup;
				window.draw = draw;
				window.keyPressed = keyPressed;
				window.keyReleased = keyReleased;
				window.keyTyped = keyTyped;
				window.mousePressed = mousePressed;
				window.mouseReleased = mouseReleased;
				window.mouseClicked = mouseClicked;
				window.doubleClicked = doubleClicked;
				window.mouseDragged = mouseDragged;
				window.mouseMoved = mouseMoved;
				window.mouseWheel = mouseWheel;
				window.touchesStarted = touchesStarted;
				window.touchesMoved = touchesMoved;
				window.touchesEnded = touchesEnded;
			}
		</script>
	</body>
</html>
`;
}

module.exports = {
	getWebviewContent
}
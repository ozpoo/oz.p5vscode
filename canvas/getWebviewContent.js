const vscode = require('vscode')
const path = require('path')

const { resolveImports } = require('./resolveImports')

const PRECEDING_LINES_IN_SCRIPT_TAG = 7

function getWebviewContent(code = '', currentPanel, editor, showRulers) {
	if (!currentPanel && !vscode.window.activeTextEditor) {
		return
	}

	const extensionPath = currentPanel.webview.asWebviewUri(vscode.Uri.file(vscode.extensions.getExtension('oz.p5vscode').extensionPath))
	const localPath = currentPanel.webview.asWebviewUri(vscode.Uri.file(path.dirname(editor.document.uri.path) + path.sep))
	code = resolveImports(code)

	return `
<!DOCTYPE html>
<html>
	<head>
		<script>
			window.localPath = '${localPath}';
			let p5rulersize = 0;
		</script>
		<script src='${extensionPath}/assets/p5.js'></script>
		<script src='${extensionPath}/assets/communication.js'></script>${showRulers ? `
		<script src='${extensionPath}/assets/ruler.js'></script>` : ``}
		<script src='${extensionPath}/assets/p5setup.js'></script>
		<link rel='stylesheet' href='${extensionPath}/assets/p5canvas.css' />
	</head>
	<body>
		<div id='mouse-position' class='absolute'></div>
		<div class='flex-1 flex-row h-full'>${showRulers ? `
			<div class='h-full'>
				<canvas id='ruler-vertical' class='h-full'></canvas>
			</div>` : ``}
			<div class='flex-1 flex-col'>${showRulers ? `
				<canvas id='ruler-horizontal' class='w-full'></canvas>` : ``}
				<div id='p5canvas' class='w-fit'></div>
			</div>
		</div>
		<script id='code'>
			const PRECEDING_LINES_IN_SCRIPT_TAG = ${PRECEDING_LINES_IN_SCRIPT_TAG}
			function runCode() {
				var draw, preload, setup
				var keyPressed, keyReleased, keyTyped
				var mousePressed, mouseReleased, mouseClicked, doubleClicked
				var mouseDragged, mouseMoved, mouseWheel
				var touchesStarted, touchesMoved, touchesEnded
				${code}
				window._customPreload = preload
				window._customSetup = setup
				window.draw = draw
				window.keyPressed = keyPressed
				window.keyReleased = keyReleased
				window.keyTyped = keyTyped
				window.mousePressed = mousePressed
				window.mouseReleased = mouseReleased
				window.mouseClicked = mouseClicked
				window.doubleClicked = doubleClicked
				window.mouseDragged = mouseDragged
				window.mouseMoved = mouseMoved
				window.mouseWheel = mouseWheel
				window.touchesStarted = touchesStarted
				window.touchesMoved = touchesMoved
				window.touchesEnded = touchesEnded
			}
		</script>
	</body>
</html>
`
}

module.exports = {
	getWebviewContent
}
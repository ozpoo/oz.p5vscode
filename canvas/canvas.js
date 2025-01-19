const vscode = require('vscode')

const path = require('path')

const { updateCode } = require('./updateCode')
const { getWebviewContent } = require('./getWebviewContent')
const { handleMessage } = require('./handleMessage')

let outputChannel
let lastKnownEditor
let currentPanel = undefined
let lastCodeHash = undefined

function initializeCanvas(context) {
	outputChannel = vscode.window.createOutputChannel('p5js console')
	lastKnownEditor = vscode.window.activeTextEditor
	lastCodeHash = undefined

	let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)
	statusBarItem.text = `$(file-media) p5js canvas`
	statusBarItem.command = 'extension.showCanvas'
	// statusBarItem.show()
	
	let statusBarItem2 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)
	statusBarItem2.text = `$(file-media) p5js canvas rulers`
	statusBarItem2.command = 'extension.toggleRulers'
	// statusBarItem2.show()

	let disposableToggleRulers = vscode.commands.registerCommand('extension.toggleRulers', () => {
		const config = vscode.workspace.getConfiguration('oz.p5')
		const showRulers = !config.get('showRulers')
		config.update('showRulers', showRulers, vscode.ConfigurationTarget.Global)
		if(currentPanel && lastKnownEditor) {
			updateCode(lastKnownEditor, outputChannel, currentPanel, lastCodeHash, showRulers)
		}
	})
	
	let didChangeTextDocument = vscode.workspace.onDidChangeTextDocument((e) => {
		if (e &&
			e.document &&
			vscode.window.activeTextEditor != undefined &&
			e.document === vscode.window.activeTextEditor.document &&
			e.document.uri.path.includes('sketch.js')) {
			let editor = vscode.window.activeTextEditor
			if (editor) {
				const showRulers = vscode.workspace.getConfiguration('oz.p5').get('showRulers')
				lastKnownEditor = editor
				updateCode(lastKnownEditor, outputChannel, currentPanel, lastCodeHash, showRulers)
			}
		}
	})
	
	let didChangeActiveEditor = vscode.window.onDidChangeActiveTextEditor((e) => {
		if (e && e.document && e.document.uri.path.includes('sketch.js')) {
			statusBarItem.show()
			let editor = vscode.window.activeTextEditor
			if (editor) {
				const showRulers = vscode.workspace.getConfiguration('oz.p5').get('showRulers')
				lastKnownEditor = editor
				updateCode(lastKnownEditor, outputChannel, currentPanel, lastCodeHash, showRulers)
			}
		} else {
			statusBarItem.hide()
		}
	})

	let didChangeTabGroups = vscode.window.tabGroups.onDidChangeTabGroups((e) => {
		const to = e.opened.filter(group => group.isActive)
		const tc = e.changed.filter(group => group.isActive)
		const label = to[0]?.activeTab?.label || tc[0]?.activeTab?.label
		if(label === 'p5js canvas') {
			statusBarItem2.show()
		} else {
			statusBarItem2.hide()
		}
		if(label === 'sketch.js') {
			console.log('group sketch')
		}
	})

	let disposableShowCanvas = vscode.commands.registerCommand('extension.showCanvas', () => {
		outputChannel.show(true)
		if (currentPanel) {
			currentPanel.reveal(vscode.ViewColumn.Two)
		} else {
			let editor = vscode.window.activeTextEditor
			if (editor) {
				lastKnownEditor = editor
			}
			let extensionPath = vscode.Uri.file(vscode.extensions.getExtension('oz.p5').extensionPath)
			let localPath = vscode.Uri.file(path.dirname(lastKnownEditor.document.uri.path))
			currentPanel = vscode.window.createWebviewPanel('p5js canvas', 'p5js canvas', vscode.ViewColumn.Two, {
				enableScripts: true,
				localResourceRoots: [extensionPath, localPath], // Maybe we can remove that
			})
			lastCodeHash = undefined
			currentPanel.webview.onDidReceiveMessage((e) => handleMessage(e, outputChannel))
			const showRulers = vscode.workspace.getConfiguration('oz.p5').get('showRulers')
			currentPanel.webview.html = getWebviewContent('', currentPanel, lastKnownEditor, showRulers)
			updateCode(lastKnownEditor, outputChannel, currentPanel, lastCodeHash, showRulers)
			currentPanel.onDidDispose(() => {
				lastCodeHash = undefined
				currentPanel = undefined
			}, undefined, context.subscriptions)
		}
	})

	let disposableSaveAsPNG = vscode.commands.registerCommand('extension.saveAsPNG', () => {
		currentPanel.webview.postMessage({
			type: 'imageRequest',
			mimeType: 'png',
		})
	})

	context.subscriptions.push(disposableShowCanvas, statusBarItem, statusBarItem2, disposableToggleRulers, disposableSaveAsPNG, didChangeTextDocument, didChangeActiveEditor, didChangeTabGroups, outputChannel)
}

module.exports = {
	initializeCanvas
}
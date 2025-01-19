const vscode = require('vscode')
const path = require('path')

function resolveImports(code, imports = []) {
	let lines = code.split('\n')
	let newLines = []
	let importedCode = []
	lines.forEach((line) => {
		if (line.includes('import ')) {
			let resolvedImport = resolveSingleImport(line, imports)
			importedCode.push(resolvedImport)
		}
		else {
			newLines.push(line)
		}
	})
	newLines = importedCode.concat(newLines)
	return newLines.join('\n')
}

function resolveSingleImport(line, imports) {
	let localPath = vscode.Uri.file(path.dirname(vscode.window.activeTextEditor.document.uri.path) + path.sep)
	let elements = line.split('')
	elements = elements[0].split(' ')
	let importPath = elements[elements.length - 1]
	importPath = importPath.slice(1, importPath.length - 1)
	let filePath = path.resolve(localPath.fsPath, importPath)
	if (path.extname(filePath) != '.js') {
		filePath += '.js'
	}
	if (imports.includes(filePath)) {
		return undefined
	}
	imports.push(filePath)
	let file = fs.readFileSync(filePath, 'utf8')
	file = file.replace('export default ', '')
	file = file.replace('export ', '')
	return resolveImports(file, imports)
}

module.exports = {
	resolveImports,
	resolveSingleImport
}
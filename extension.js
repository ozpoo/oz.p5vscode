const { updateConfig } = require('./utils/updateConfig')

const { initializeColorProvider } = require('./providers/colorProvider')
const { initializeCreateProject } = require('./commands/createProject')
const { initializeInstallLibrary } = require('./commands/installLibrary')
const { initializeCanvas } = require('./canvas/canvas')

async function activate(context) {
	await updateConfig(context)

	initializeColorProvider(context)
	initializeCreateProject(context)
	initializeInstallLibrary(context)

	initializeCanvas(context)
}
5
function deactivate() {
	return undefined
}

module.exports = {
	activate,
	deactivate
}

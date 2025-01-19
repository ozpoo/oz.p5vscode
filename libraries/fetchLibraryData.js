const { writeFileSync } = require('fs')
const jsYaml = require('js-yaml')
const libraryInstallURLS = require('./libraryInstallationUrls.json')

// Downloads contributor library info from the git repo for the p5.js website 
// and generates a json file combining descriptions, meta info, and library download urls.
const LIBRARY_META_URL = 'https://api.github.com/repos/processing/p5.js-website/contents/src/content/libraries/en?recursive=1'

async function fetchLibraryData() {
	try {
		// Fetch library metadata
		const metaResponse = await fetch(LIBRARY_META_URL)
		const libraryDirectory = await metaResponse.json()

		const allLibraries = await Promise.all(libraryDirectory.map(async library => {
			const libraryReponse = await fetch(library.download_url)
			const libraryText = await libraryReponse.text()
			return {
				...library,
				...jsYaml.load(libraryText)
			}
		}))

		console.log(allLibraries)

		// Process and combine library data
		const processedLibraries = allLibraries
			.filter(lib => lib.name !== 'p5.sound')
			.map(library => {
				const installUrl = libraryInstallURLS[library.name]

				if (!installUrl) {
					console.error('Missing install url for', library.name, library.url)
					return null
				}

				return {
					...library,
					desc: descriptions[library.name],
					install: installUrl
				}
			})
			.filter(Boolean) // Remove null entries

		// Write combined data to file
		writeFileSync(
			'src/libraries.json',
			JSON.stringify(processedLibraries, null, 2)
		)
	} catch (error) {
		console.error('Error processing library data:', error)
	}
}

fetchLibraryData()
const vscode = require('vscode')

function initializeColorProvider(context) {
	const provider = vscode.languages.registerColorProvider(
		{
			language: 'javascript',
			scheme: 'file'
		},
		new P5jsColorProvider()
	)
	context.subscriptions.push(provider)
}

class P5jsColorProvider {
	provideDocumentColors(document) {
		const text = document.getText();

		// Regex to match color-related functions in p5.js
		const regex = /(?<=(fill|stroke|background|color|ambientMaterial|emissiveMaterial|specularMaterial|shininess|setGradient)\s*\(\s*)(-?\d+\.?\d*)\s*(?:,\s*(-?\d+\.?\d*))?\s*(?:,\s*(-?\d+\.?\d*))?\s*(?:,\s*(-?\d+\.?\d*))?/g;

		const colors = [];
		let match;

		while ((match = regex.exec(text))) {
			// Extract RGBA values
			const r = parseFloat(match[2]) / 255;
			const g = match[3] ? parseFloat(match[3]) / 255 : r; // If `g` is not defined, it falls back to `r`
			const b = match[4] ? parseFloat(match[4]) / 255 : r; // If `b` is not defined, it also falls back to `r`
			const a = match[5] ? parseFloat(match[5]) : 1;        // Alpha defaults to 1 (opaque) if not provided

			// Ensure valid values
			if (![r, g, b, a].some(isNaN)) {
				const range = new vscode.Range(
					document.positionAt(match.index),
					document.positionAt(match.index + match[0].length)
				);

				colors.push(new vscode.ColorInformation(range, new vscode.Color(r, g, b, a)));
			}
		}

		return colors;
	}

	provideColorPresentations(color) {
		// Convert color components to integers
		const r = Math.round(color.red * 255);
		const g = Math.round(color.green * 255);
		const b = Math.round(color.blue * 255);
		const a = Math.round(color.alpha * 100) / 100; // Round alpha for cleaner display

		// Use a robust format for displaying colors
		const label = a < 1 ? `${r}, ${g}, ${b}, ${a}` : `${r}, ${g}, ${b}`;
		return [new vscode.ColorPresentation(label)];
	}
}

module.exports = {
	initializeColorProvider
}
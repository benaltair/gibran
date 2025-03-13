import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the full text file
const txtPath = path.join(__dirname, 'the-prophet.txt');
let fullText = fs.readFileSync(txtPath, 'utf-8');

// Optionally remove the Gutenberg header if present
const startMarker = '*** START OF THE PROJECT GUTENBERG EBOOK THE PROPHET ***';
const startIndex = fullText.indexOf(startMarker);
if (startIndex !== -1) {
	fullText = fullText.slice(startIndex + startMarker.length).trim();
} else {
	console.warn('Start marker not found; proceeding with full text.');
}

// Split the text using a lookahead for "speak to us of" (case-insensitive)
// This preserves the delimiter in the resulting parts.
const parts = fullText.split(/(?=speak to us of\s+)/i);

// Filter out any parts that do not start with "speak to us of"
const chaptersText = parts.filter((part) => /^speak to us of/i.test(part));

console.log(`Extracted ${chaptersText.length} chapters from text.`);

// Expected chapters array (27 items)
const expectedChapters = [
	{ title: 'The Coming of the Ship', slug: 'coming-of-the-ship', order: 1 },
	{ title: 'Love', slug: 'love', order: 2 },
	{ title: 'Marriage', slug: 'marriage', order: 3 },
	{ title: 'Children', slug: 'children', order: 4 },
	{ title: 'Giving', slug: 'giving', order: 5 },
	{ title: 'Eating and Drinking', slug: 'eating-and-drinking', order: 6 },
	{ title: 'Work', slug: 'work', order: 7 },
	{ title: 'Joy and Sorrow', slug: 'joy-and-sorrow', order: 8 },
	{ title: 'Houses', slug: 'houses', order: 9 },
	{ title: 'Clothes', slug: 'clothes', order: 10 },
	{ title: 'Buying and Selling', slug: 'buying-and-selling', order: 11 },
	{ title: 'Crime and Punishment', slug: 'crime-and-punishment', order: 12 },
	{ title: 'Laws', slug: 'laws', order: 13 },
	{ title: 'Freedom', slug: 'freedom', order: 14 },
	{ title: 'Reason and Passion', slug: 'reason-and-passion', order: 15 },
	{ title: 'Pain', slug: 'pain', order: 16 },
	{ title: 'Self-Knowledge', slug: 'self-knowledge', order: 17 },
	{ title: 'Teaching', slug: 'teaching', order: 18 },
	{ title: 'Friendship', slug: 'friendship', order: 19 },
	{ title: 'Talking', slug: 'talking', order: 20 },
	{ title: 'Time', slug: 'time', order: 21 },
	{ title: 'Good and Evil', slug: 'good-and-evil', order: 22 },
	{ title: 'Prayer', slug: 'prayer', order: 23 },
	{ title: 'Pleasure', slug: 'pleasure', order: 24 },
	{ title: 'Beauty', slug: 'beauty', order: 25 },
	{ title: 'Religion', slug: 'religion', order: 26 },
	{ title: 'Death', slug: 'death', order: 27 }
];

if (chaptersText.length !== expectedChapters.length) {
	console.warn(
		`Number of extracted chapters (${chaptersText.length}) does not match expected (${expectedChapters.length}).`
	);
}

// Process each chapter text by finding the first non-empty line containing "of" and bolding that entire line.
const processedParts = chaptersText.map((text) => {
	const lines = text.split('\n');
	// Find the first non-empty line that contains "of" (case-insensitive)
	const idx = lines.findIndex((line) => line.trim() !== '' && line.toLowerCase().includes('of '));
	if (idx !== -1) {
		lines[idx] = '**' + lines[idx].trim() + '**';
	}
	return lines.join('\n');
});

// Ensure the output directory exists
const outputDir = path.join(__dirname, 'chapters');
if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir, { recursive: true });
}

// Write each chapter to its own .svx file with frontmatter.
expectedChapters.forEach((chap, idx) => {
	const content = processedParts[idx] || '';
	const frontmatter = `---
title: "${chap.title}"
slug: "${chap.slug}"
order: ${chap.order}
---

`;
	const outputContent = frontmatter + content;
	const filename = path.join(outputDir, `${chap.slug}.svx`);
	fs.writeFileSync(filename, outputContent, 'utf-8');
	console.log(`Generated ${filename}`);
});

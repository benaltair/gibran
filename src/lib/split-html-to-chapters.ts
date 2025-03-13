// src/lib/split-html-to-chapters.ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your HTML file (adjust if necessary)
const HTML_FILE = path.join(
	__dirname,
	'The Project Gutenberg eBook of The Prophet, by Kahlil Gibran.html'
);
const htmlContent = fs.readFileSync(HTML_FILE, 'utf-8');

// Load HTML into Cheerio
const $ = cheerio.load(htmlContent);

// We'll assume each chapter is in a <div class="chapter">
const chapterDivs = $('div.chapter');

// Interface for chapter data
interface Chapter {
	title: string;
	slug: string;
	order: number;
	content: string;
}

const chapters: Chapter[] = [];

// Create an instance of TurndownService to convert HTML to Markdown
const turndownService = new TurndownService({
	headingStyle: 'atx',
	hr: '---',
	bulletListMarker: '-'
});

// Process each chapter element
chapterDivs.each((i, elem) => {
	const chapterElem = $(elem);

	// Clone chapter HTML for processing
	let chapterHtml = chapterElem.html() || '';

	// Wrap content in a container to process children
	const $container = cheerio.load(`<div id="container">${chapterHtml}</div>`);

	// For the first chapter, remove any heading elements at the very start.
	if (i === 0) {
		$container('#container').children('h1, h2, h3, h4, h5, h6').first().remove();
	}

	// Collapse paragraphs:
	// Merge <p> elements that do NOT have class "p2" into one paragraph.
	// When a <p class="p2"> is encountered, flush the current merged content as one paragraph and then output that element separately.
	const newElements: string[] = [];
	const merged: string[] = [];
	$container('#container')
		.children()
		.each((idx, el) => {
			if (el.tagName === 'p') {
				const pElem = $container(el);
				if (pElem.hasClass('p2')) {
					if (merged.length > 0) {
						newElements.push(`<p>${merged.join(' ')}</p>`);
						merged.length = 0;
					}
					newElements.push(pElem.text().trim());
				} else {
					merged.push(pElem.text().trim());
				}
			} else {
				if (merged.length > 0) {
					newElements.push(`<p>${merged.join(' ')}</p>`);
					merged.length = 0;
				}
				newElements.push($container.html(el));
			}
		});
	if (merged.length > 0) {
		newElements.push(`<p>${merged.join(' ')}</p>`);
	}
	const newChapterHtml = newElements.join('\n');

	// Convert the new chapter HTML to Markdown
	const markdownContent = turndownService.turndown(newChapterHtml);

	// Determine chapter title.
	// Try to find a heading element inside the container (after removals)
	let title = $container('#container').find('h1, h2, h3, h4, h5, h6').first().text().trim();
	if (!title) {
		// Fallback: look for a bold italic title in a paragraph.
		const fallback = $container('#container').find('p b i').first().text().trim();
		title = fallback || `Chapter ${i + 1}`;
	}
	// Override titles for first and last chapters
	if (i === 0) {
		title = 'Beginnings';
	}
	if (i === chapterDivs.length - 1) {
		title = 'Final Farewell';
	}
	// Create slug
	const slug = title
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^\w\-]+/g, '');

	chapters.push({
		title,
		slug,
		order: i + 1,
		content: markdownContent
	});
});

// Output directory for mdsvex chapter files (e.g., src/lib/chapters)
const OUTPUT_DIR = path.join(__dirname, 'chapters');
if (!fs.existsSync(OUTPUT_DIR)) {
	fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Write each chapter as an .svx file with YAML frontmatter
chapters.forEach((chapter) => {
	const frontmatter = `---
title: "${chapter.title}"
slug: "${chapter.slug}"
order: ${chapter.order}
---

`;
	const outputContent = frontmatter + chapter.content;
	const outputFile = path.join(OUTPUT_DIR, `${chapter.slug}.svx`);
	fs.writeFileSync(outputFile, outputContent, 'utf-8');
	console.log(`Generated ${outputFile}`);
});

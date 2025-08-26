# gibran

SvelteKit 2 + Svelte 5 app with mdsvex. Configured for Cloudflare via `@sveltejs/adapter-cloudflare`.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Notes

- Adapter: Cloudflare (`@sveltejs/adapter-cloudflare`).
- Content: mdsvex enabled (see `svelte.config.js`, `extensions: ['.svelte', '.svx']`).
- Utilities: `cheerio` and `turndown` are available for HTML parsing/markdown conversion.

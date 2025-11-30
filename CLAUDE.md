# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

## Project Overview

This is **Mia Hopman's personal academic website** hosted on GitHub Pages at [mahopman.github.io](https://mahopman.github.io). It's a static site with no build system - just HTML, CSS, and vanilla JavaScript.

## Directory Structure

```
/
├── index.html              # Main (and only) HTML page
├── assets/
│   ├── css/styles.css      # All styling
│   ├── js/research.js      # Dynamically loads and renders papers
│   ├── data/papers.json    # Research publications data
│   ├── pdf/Hopman_CV.pdf   # CV document
│   └── mia-hopman.jpeg     # Headshot image
├── README.md
└── .gitignore
```

## Key Files

### `index.html`
The single-page website containing all sections: Biography, Research, News, Education, and Experience. The Research section is dynamically populated by JavaScript.

### `assets/data/papers.json`
Array of publication objects with the following schema:
```json
{
  "title": "Paper Title",
  "authors": "LastName, First; LastName2, First2",  // Semicolon-separated
  "year": 2025,
  "journal": "Journal Name",           // or "booktitle" for conferences
  "links": [
    { "label": "Paper", "href": "https://..." },
    { "label": "Code", "href": "https://..." }
  ],
  "representative": true               // Optional: highlights important work
}
```

Papers are automatically sorted by year (most recent first). The author "Hopman" is automatically bolded.

### `assets/js/research.js`
Fetches `papers.json` and renders the Research section. Supports both structured `links` arrays and legacy `url`/`code`/`bibtex` properties.

### `assets/css/styles.css`
Uses CSS custom properties for theming (defined in `:root`). Key variables:
- `--accent: #0047ff` (blue for links and highlights)
- `--text`, `--muted`, `--bg`, `--border`

## Common Tasks

### Adding a New Publication
Add an object to `assets/data/papers.json`. Required fields: `title`, `authors`, `year`. Optional: `links`, `representative`, `journal`/`booktitle`.

### Adding a News Item
Edit `index.html` and add a `<li>` element inside the `.news-list` in the News section. Format: `[MM/DD/YY] Description`.

### Updating Education/Experience
Edit the corresponding `<section>` in `index.html`.

## Development

No build step required. To preview locally:
```bash
python -m http.server 8000
# or
npx serve
```

Then open http://localhost:8000

## Deployment

The site deploys automatically via GitHub Pages when changes are pushed to the main branch.

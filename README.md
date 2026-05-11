# Totonoe PDF

Browser-based PDF utility for splitting spread pages and interleaving front/back scans.

## End User Guide

For usage instructions, open the website:

- https://totonoe-pdf.web.app/

## Developer Notes

This repository is a static web app (HTML/CSS/JavaScript) with no build step.

### Local Development

1. Clone the repository and move into the project directory.
2. Start a local static server (recommended):

```bash
python3 -m http.server 8080
```

3. Open `http://localhost:8080` in your browser.

Alternative:

- Open `index.html` directly in your browser (no server).

### Main Files

- `index.html`: UI and end-user documentation
- `app.js`: app entry point
- `split.js`: spread page split logic
- `merge.js`: front/back interleave merge logic
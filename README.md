# PDF Utility

Browser-based PDF utility with two modes:

- Merge: interleave `front` and reversed `back` pages  
  (`front[0], back[-1], front[1], back[-2], ...`)
- Split: split A3 spread pages into two A4-like pages with rotation/order options

## Files

- `index.html` - main app (single-file web UI)

## How to use

1. Open `index.html` in a modern browser.
2. Select mode:
   - **Merge**: choose Front PDF and Back PDF, then click **Merge PDF**
   - **Split**: choose input PDF, set rotation/order, then click **Split PDF**
3. Preview the result and download from the generated link.

## Notes

- Runs fully in the browser (no server-side processing).
- Uses CDN modules:
  - `pdf-lib`
  - `pdfjs-dist`
- For best compatibility (especially on mobile), serve over `https` when possible.

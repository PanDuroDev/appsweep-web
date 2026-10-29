# AppSweep website

A responsive static website for the experimental AppSweep project.

## Releases and downloads

- The homepage links directly to the latest official Windows package when a published release contains one.
- The Releases page lists published GitHub releases and links to each release's internal file list and original GitHub page.
- Release details group actual assets into Windows, Linux, macOS, source code, and other files. Missing categories are marked unavailable.
- An empty release list is distinct from a network/API error. The UI offers retry for errors.
- Public release metadata is fetched from the GitHub Releases API in the browser.

## Design system

The site follows Material 3 semantic color, typography, shape, tonal surface, responsive layout, and interaction-state guidance through CSS tokens. The dark surface is **#111111** and the main dark-theme text is **#eaeaea**. Custom gradients, shadows, backdrop blur, arbitrary radii, and decorative hover movement are excluded. Web platform limitations are documented in `DESIGN_SYSTEM.md`.

## Local development

    python -m http.server 8123 --bind 127.0.0.1

On Windows, use `py -3 -m http.server 8123 --bind 127.0.0.1`. Then open http://127.0.0.1:8123/.

## Tests

With Node.js 22 or newer:

    node --test tests/*.test.cjs

Pushes to `main` run static validation and behavior tests, then deploy GitHub Pages.

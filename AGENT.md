# Agent Guide — AppSweep Website

## Project overview

This repository contains the **public website** for [AppSweep](https://github.com/PanDuroDev/appsweep), an experimental, open-source Windows 10/11 application manager. It is separate from the main AppSweep desktop application repository.

- Live site: https://pandurodev.github.io/appsweep-web/
- Desktop app source: https://github.com/PanDuroDev/appsweep
- Project status: **pre-alpha**; do not describe AppSweep as stable or production-ready.

## Current website status

The site is a lightweight static HTML/CSS/JavaScript project with no frontend framework or build step.

- `index.html`: project overview, workflow, safety notice, and latest-release panel.
- `docs.html`: documentation page.
- `releases.html`: published releases list.
- `release.html`: release details and downloadable assets.
- `app.js`: page behavior and GitHub Releases API integration.
- `tokens.css` and `styles.css`: shared design tokens and responsive styling.
- `DESIGN_SYSTEM.md`: design rules and implementation boundaries.
- `tests/`: Node.js tests for behavior, layout, and motion.
- GitHub Actions validates the static site and tests, then deploys GitHub Pages from `main`.

The site includes a Material 3-inspired semantic design system, dark/light theme support, keyboard focus and reduced-motion handling, and a wide responsive layout. On large screens, the homepage places the hero beside the latest-release panel; documentation uses a side navigation rail; release cards and asset groups adapt to available width.

The latest completed layout change was merged in PR #3 (commit `a7d69d3`). Its CI run reported **27 passing tests**, successful static validation, and successful deployment. This records the state at that run; always check the latest workflow before relying on it.

## Development and verification

Run the website locally from the repository root:

```sh
python -m http.server 8123 --bind 127.0.0.1
```

On Windows, `py -3 -m http.server 8123 --bind 127.0.0.1` also works. Open http://127.0.0.1:8123/.

Run tests with Node.js 22 or newer:

```sh
node --test tests/*.test.cjs
```

Before submitting changes, run the tests and inspect the relevant pages at narrow, medium, and wide viewport sizes. Check the GitHub Actions result after pushing or merging; passing local tests alone does not prove Pages deployed successfully.

## Rules for future changes

1. Keep this repository focused on the **website**. Make desktop-application code changes in the main AppSweep repository instead.
2. Preserve the existing static HTML/CSS/JavaScript approach unless there is a clear, approved reason to change it.
3. Follow `DESIGN_SYSTEM.md` and use existing CSS custom properties in `tokens.css`. Avoid ad-hoc colors, decorative gradients, shadows, backdrop blur, arbitrary corner radii, and hover movement.
4. Preserve semantic HTML, accessible names, visible keyboard focus, responsive layouts, forced-colors support, and `prefers-reduced-motion` behavior.
5. Keep release information sourced from the official GitHub Releases API. Do not fabricate releases, versions, assets, or download links; distinguish an empty release list from a network/API error.
6. Treat the application as pre-alpha. Keep safety wording accurate, especially around reviewing paths and deleting files.
7. Update or add tests when behavior or layout changes. Do not claim visual verification unless the relevant pages were actually inspected at the target viewport sizes.

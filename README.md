# AppSweep website

A responsive, text-first download and documentation site for the pre-alpha Windows project. No application screenshots or simulated application interface.

## Design

The layout, Google Sans Flex font, rose `#FF5CA8` Tonal Spot palette, shape silhouettes, and card proportions closely follow [metawka/expressive-profile](https://github.com/metawka/expressive-profile), adapted to AppSweep's real content. See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for values and attribution.

Plain HTML/CSS/JavaScript. No framework, package manager, build step, backend, or API key. The main font is local; Material Symbols load from Google Fonts. JavaScript adds persistent light/dark themes, reading progress, and a live GitHub release lookup with a rotating, morphing loading indicator. All navigation and the releases link work without JavaScript.

## Preview and checks

Serve this directory over HTTP:

```sh
python -m http.server 8123 --bind 127.0.0.1
```

On Windows, use `py -3 -m http.server 8123 --bind 127.0.0.1` if `python` is unavailable. Open http://127.0.0.1:8123/.

Run the dependency-free behavior checks with Node.js 22 or newer:

```sh
node --test tests/app.test.cjs
```

The Pages workflow also validates markup, links, CSS tokens, documentation classes, and cache versions. Pushes to `main` deploy the static files to https://pandurodev.github.io/appsweep-web/.

GitHub can be unavailable or rate-limited; the page falls back to the official releases link. No published release is a valid state, not a promised download. AppSweep is experimental: review results and back up important data before testing.

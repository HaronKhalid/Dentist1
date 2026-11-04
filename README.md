# Dentelle Studio clone

Static, self-hosted copy of https://dentelle.framer.website (Journal removed, Framer badge removed).

- Desktop (>=1200px) is shown at 70% (>=1600px) / 80% (1200-1599px) scale: each page loads itself inside a scaled iframe (see `clone-shell` script in every page). Tablet/mobile are untouched.
- Works at a domain root or in a sub-path (GitHub Pages `/Dentist1/`). `.nojekyll` is required on GitHub Pages.
- `sw.js` caches the static assets (bump `VERSION` in it on every deploy that changes `_a/`).
- Local: `node serve.mjs 3000` (or double-click `start.bat`); mimic GitHub Pages: `MSYS_NO_PATHCONV=1 node serve.mjs 3000 /Dentist1`.
- Opening index.html by double-click does not work (browsers block ES modules on file://).

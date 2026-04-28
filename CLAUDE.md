# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
A custom browser start page — static HTML/CSS/JS, no build step, no dependencies. Works when opened as a local file or served from GitHub Pages.

## Development
Serve locally to avoid browser `file://` restrictions on external scripts:
```
python -m http.server
```
Then open `http://localhost:8000`. Alternatively use VS Code's Live Server extension.

## Architecture
Three files, each with a single responsibility:

- **[index.html](index.html)** — markup only. Links section is hardcoded here; edit `<a class="link-item">` blocks to add/remove hotlinks. Favicon URLs use `https://www.google.com/s2/favicons?domain=<domain>&sz=32` for sites with their own domain. For GitHub Pages subpaths (e.g. own projects at `nickeniklas.github.io/x`), use a direct `<img src>` to the favicon file — Google's service only resolves root domains, not paths.
- **[style.css](style.css)** — all styling. Theme tokens are CSS variables in `:root` at the top of the file — change accent color, surfaces, and borders there.
- **[script.js](script.js)** — two concerns: a `setInterval` clock, and `loadNews()` which fetches HN front-page stories from the Algolia HN API (`hn.algolia.com/api/v1/search`) in a single request and renders them into `#news-list`.

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

- **[index.html](index.html)** — markup only: a `header` (clock block only — no search), the links `.card`, and the news `.card`, as direct children of `body`. Links are rendered by `script.js` from `localStorage` (see below), not hardcoded — `#links-grid` starts empty and is filled at runtime.
- **[style.css](style.css)** — all styling. Theme tokens are CSS variables in `:root` at the top of the file — change accent color, surfaces, and borders there. `body` is itself the grid (`grid-template-rows: auto auto 1fr` for header/links-card/news-card), locked to `100dvh` with `overflow: hidden` so the page never scrolls on desktop, capped at `max-width: 1400px` with `margin-inline: auto` for a centered column on wide monitors. All sizing uses `rem`, scaled globally via `html` font-size (`16px`, `18px` above `1600px` viewport width) — don't add per-element media-query size overrides for that scaling; the one exception is the `max-width: 680px` query, which drops the fixed-viewport lock (`height: auto`, `overflow: visible`) so small screens can scroll normally.
- **[script.js](script.js)** — three concerns: a `setInterval` clock; hotlink state (`DEFAULT_LINKS` array, `localStorage`-backed, rendered into `#links-grid` with an edit mode — add/remove/reset); and `loadNews()`, which fetches 40 HN front-page stories from the Algolia HN API (`hn.algolia.com/api/v1/search`) in a single request and renders them into `#news-list`, which scrolls internally within the news card.

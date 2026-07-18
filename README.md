# browser-startpage

A minimal dark-themed browser start page. No build tools, no dependencies — pure HTML, CSS, and JavaScript.

Screenshot:
<img width="1867" height="627" alt="image" src="https://github.com/user-attachments/assets/cf027e2a-8e3d-4cc8-862c-44d57c0a60f7" />


## Features

- **Clock** — live time, date, and ISO week number
- **Hotlinks** — pill-style quick-launch links with favicons, editable in the browser and saved to `localStorage`
- **Hacker News feed** — top 40 front-page stories via the Algolia HN API, with points, comment count, and source domain

## Layout

The page is viewport-locked: on desktop it always fills the browser window exactly (`100dvh`, no page scroll), with the clock, hotlinks card, and news card stacked as `auto auto 1fr` grid rows so the news card's bottom edge always meets the bottom of the page — no leftover empty space on tall monitors. Content sits in a centered column capped at `1400px`; on wider monitors this leaves intentional side margins rather than stretching edge to edge.

All sizing is driven by the root font size (`16px`, bumped to `18px` above `1600px` viewport width) rather than per-element breakpoints, so the whole page scales as one unit on large displays.

Hotlinks are a compact pill row that wraps to fit; the news card fills the remaining height below and scrolls internally in a 2-column grid so headlines use the full card width.

Below `680px` the fixed-viewport behavior is dropped and the page scrolls normally, since `100dvh` is too cramped on small screens.

## Usage

Open `index.html` directly in a browser, or serve locally to avoid `file://` script restrictions:

```
python -m http.server
```

Then visit `http://localhost:8000`.

## Editing links

Click **✎** on the Links card to enter edit mode:

- **Remove** — click the × on any pill.
- **Add** — paste a URL (optionally give it a name) and press Add. The favicon is fetched automatically from Google's favicon service. If no name is given, one is derived from the hostname.
- **Reset** — restores the default link set defined in `script.js`.

Changes are saved to `localStorage`, so they persist across reloads but are per-browser and per-origin (`file://`, `localhost`, and GitHub Pages each keep their own set).

## Customisation

- **Default links** — edit the `DEFAULT_LINKS` array in `script.js`. These seed the page on first load and are what "reset" restores.
- **Favicons** — added links use `https://www.google.com/s2/favicons?domain=example.com&sz=32` automatically. For GitHub Pages subpaths (e.g. `nickeniklas.github.io/myproject`), Google's service won't resolve path-specific favicons — set the `icon` field in `DEFAULT_LINKS` directly to the favicon file instead (e.g. `https://nickeniklas.github.io/myproject/assets/favicon.ico`).
- **Theme** — CSS variables in the `:root` block at the top of `style.css` control all colors.
- **Scale** — `html` font-size in `style.css` (`16px` base, `18px` above `1600px` viewport width) drives the size of everything else, since all other sizing uses `rem`.
- **News count** — change `hitsPerPage=40` in `script.js` to show more or fewer stories.

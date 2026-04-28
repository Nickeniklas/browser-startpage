# browser-startpage

A minimal dark-themed browser start page. No build tools, no dependencies — pure HTML, CSS, and JavaScript.

## Features

- **Clock** — live time, date, and ISO week number
- **DuckDuckGo search** — autofocused on load
- **Hotlinks** — pill-style quick-launch links with favicons, stacked above the news feed
- **Hacker News feed** — top 20 front-page stories via the Algolia HN API, with points, comment count, and source domain

## Layout

Single column: hotlinks card at the top (compact pill row, wraps to fit), news feed fills the remaining page height below. The news feed renders in a 2-column grid so headlines use the full card width.

## Usage

Open `index.html` directly in a browser, or serve locally to avoid `file://` script restrictions:

```
python -m http.server
```

Then visit `http://localhost:8000`.

## Customisation

- **Links** — edit the `<a class="link-item">` blocks in `index.html`.
- **Favicons** — use `https://www.google.com/s2/favicons?domain=example.com&sz=32` for sites with their own domain. For GitHub Pages subpaths (e.g. `nickeniklas.github.io/myproject`), Google's service won't resolve path-specific favicons — point `src` directly at the favicon file instead (e.g. `https://nickeniklas.github.io/myproject/assets/favicon.ico`).
- **Theme** — CSS variables in the `:root` block at the top of `style.css` control all colors.
- **News count** — change `hitsPerPage=20` in `script.js` to show more or fewer stories.

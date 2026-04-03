# browser-startpage

A minimal dark-themed browser start page. No build tools, no dependencies — pure HTML, CSS, and JavaScript.

## Features

- **Clock** — live time and date
- **DuckDuckGo search** — autofocused on load
- **Hotlinks** — pill-style quick-launch links with favicons
- **Hacker News feed** — top 20 front-page stories via the Algolia HN API, with points, comment count, and source domain

## Usage

Open `index.html` directly in a browser, or serve locally to avoid `file://` script restrictions:

```
python -m http.server
```

Then visit `http://localhost:8000`.

## Customisation

- **Links** — edit the `<a class="link-item">` blocks in `index.html`. Favicons are fetched automatically via `google.com/s2/favicons`.
- **Theme** — CSS variables in the `:root` block at the top of `style.css` control all colors.
- **News count** — change `hitsPerPage=20` in `script.js` to show more or fewer stories.

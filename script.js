// ── Clock ──────────────────────────────────────────────────────────────────
const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

function isoWeek(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
}

function tick() {
  const now = new Date();
  document.getElementById('clock').textContent =
    now.toLocaleTimeString('en-GB', { hour12: false });
  document.getElementById('date').textContent =
    `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()} · Week ${isoWeek(now)}`;
}
tick();
setInterval(tick, 1000);

// ── Links (localStorage-backed, editable) ──────────────────────────────────
const LINKS_KEY = 'startpage-links';

const DEFAULT_LINKS = [
  { name: 'YouTube',          url: 'https://youtube.com',              icon: favicon('youtube.com') },
  { name: 'Gmail',            url: 'https://gmail.com',                icon: favicon('gmail.com') },
  { name: 'Calendar',         url: 'https://calendar.google.com',     icon: favicon('calendar.google.com') },
  { name: 'GitHub',           url: 'https://github.com',              icon: favicon('github.com') },
  { name: 'HN',               url: 'https://news.ycombinator.com',    icon: favicon('news.ycombinator.com') },
  { name: 'Yahoo Finance',    url: 'https://finance.yahoo.com',       icon: favicon('finance.yahoo.com') },
  { name: 'S&P 500 Heatmap',  url: 'https://www.tradingview.com/heatmap/stock/?color=change&dataset=SPX500&group=sector&size=market_cap_basic',
                              icon: favicon('tradingview.com') },
  { name: 'Claude',           url: 'https://claude.ai',               icon: favicon('claude.ai') },
  { name: 'GeoFill',          url: 'https://nickeniklas.github.io/geofill/index.html',
                              icon: 'https://nickeniklas.github.io/geofill/assets/favicon.ico' },
  { name: 'Tech Digest',      url: 'https://nickeniklas.github.io/tech-digest/index.html',
                              icon: 'https://nickeniklas.github.io/tech-digest/assets/favicon.svg' },
  { name: 'Toukolanmestarit', url: 'https://toukolanmestarit.fi/',    icon: favicon('toukolanmestarit.fi') },
  { name: 'Suomi.fi',         url: 'https://www.suomi.fi/',           icon: favicon('www.suomi.fi') },
  { name: 'Portfolio',        url: 'https://portfolio-site-5bt.pages.dev/',
                              icon: 'https://portfolio-site-5bt.pages.dev/favicon.svg' },
];

function favicon(domain) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
}

function loadLinks() {
  try {
    const stored = JSON.parse(localStorage.getItem(LINKS_KEY));
    if (Array.isArray(stored)) return stored;
  } catch { /* fall through to defaults */ }
  return structuredClone(DEFAULT_LINKS);
}

function saveLinks() {
  localStorage.setItem(LINKS_KEY, JSON.stringify(links));
}

let links = loadLinks();
let editing = false;

function renderLinks() {
  const grid = document.getElementById('links-grid');
  grid.innerHTML = links.map((l, i) => `
    <a class="link-item" href="${esc(l.url)}" target="_blank" rel="noopener" data-index="${i}">
      <img src="${esc(l.icon)}" alt=""
           data-fallback="${esc(favicon(new URL(l.url).hostname))}"
           onerror="if(this.dataset.fallback){this.src=this.dataset.fallback;this.dataset.fallback='';}else{this.style.visibility='hidden';}">
      <span>${esc(l.name)}</span>
      <button class="link-remove" title="Remove ${esc(l.name)}" aria-label="Remove ${esc(l.name)}">&times;</button>
    </a>`).join('');
}

// Remove clicks + block navigation while editing (event delegation)
document.getElementById('links-grid').addEventListener('click', (e) => {
  if (!editing) return;
  e.preventDefault();
  if (e.target.classList.contains('link-remove')) {
    const i = Number(e.target.closest('.link-item').dataset.index);
    links.splice(i, 1);
    saveLinks();
    renderLinks();
  }
});

// ── Edit mode toggle ──
const linksCard  = document.getElementById('links-card');
const editToggle = document.getElementById('links-edit-toggle');

editToggle.addEventListener('click', () => {
  editing = !editing;
  linksCard.classList.toggle('editing', editing);
  editToggle.textContent = editing ? 'Done' : '✎';
  editToggle.title = editing ? 'Finish editing' : 'Edit links';
  if (editing) document.getElementById('add-url').focus();
});

// ── Add link form ──
document.getElementById('add-link-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const urlInput  = document.getElementById('add-url');
  const nameInput = document.getElementById('add-name');

  let raw = urlInput.value.trim();
  if (!raw) return;
  if (!/^https?:\/\//i.test(raw)) raw = 'https://' + raw;

  let url;
  try { url = new URL(raw); }
  catch { urlInput.classList.add('invalid'); return; }
  urlInput.classList.remove('invalid');

  const host = url.hostname.replace(/^www\./, '');
  const name = nameInput.value.trim() ||
    host.split('.')[0].charAt(0).toUpperCase() + host.split('.')[0].slice(1);

  // Prefer the site's own favicon at the link's path (handles project subpaths);
  // renderLinks() falls back to Google's cache if it 404s.
  const localIcon = new URL('./favicon.ico', url.href).href;
  links.push({ name, url: url.href, icon: localIcon });
  saveLinks();
  renderLinks();
  urlInput.value = '';
  nameInput.value = '';
  urlInput.focus();
});

document.getElementById('add-url').addEventListener('input', (e) => {
  e.target.classList.remove('invalid');
});

// ── Reset to defaults ──
document.getElementById('links-reset').addEventListener('click', () => {
  if (!confirm('Reset links to defaults? Your custom links will be lost.')) return;
  links = structuredClone(DEFAULT_LINKS);
  saveLinks();
  renderLinks();
});

renderLinks();

// ── HN top stories via Algolia (single request, CORS-friendly) ────────────
async function loadNews() {
  const list = document.getElementById('news-list');
  try {
    const res = await fetch(
      'https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=40'
    );
    if (!res.ok) throw new Error(res.status);
    const { hits } = await res.json();

    list.innerHTML = hits.map(item => {
      const href   = item.url || `https://news.ycombinator.com/item?id=${item.objectID}`;
      const domain = (() => {
        try { return item.url ? new URL(item.url).hostname.replace(/^www\./, '') : ''; }
        catch { return ''; }
      })();
      const meta = [
        item.points != null       ? `${item.points} pts`         : null,
        item.num_comments != null ? `${item.num_comments} comments` : null,
        domain || null,
      ].filter(Boolean).join(' · ');

      return `<div class="news-item">
        <a href="${esc(href)}" target="_blank" rel="noopener">${esc(item.title)}</a>
        <div class="news-meta">${esc(meta)}</div>
      </div>`;
    }).join('');
  } catch {
    list.innerHTML = '<div class="news-status">Could not load news.</div>';
  }
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

loadNews();

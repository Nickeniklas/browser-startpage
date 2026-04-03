// ── Clock ──────────────────────────────────────────────────────────────────
const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

function tick() {
  const now = new Date();
  document.getElementById('clock').textContent =
    now.toLocaleTimeString('en-GB', { hour12: false });
  document.getElementById('date').textContent =
    `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}`;
}
tick();
setInterval(tick, 1000);

// ── HN top stories via Algolia (single request, CORS-friendly) ────────────
async function loadNews() {
  const list = document.getElementById('news-list');
  try {
    const res = await fetch(
      'https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=20'
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

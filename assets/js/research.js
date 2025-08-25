(() => {
  async function loadPapers() {
    const container = document.getElementById('papers');
    if (!container) return;

    try {
      const response = await fetch('assets/data/papers.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to load papers.json');
      const items = await response.json();

      if (!Array.isArray(items) || items.length === 0) {
        container.innerHTML = '<p>No publications available yet.</p>';
        return;
      }

      const sorted = items.slice().sort(sortByRecency);
      container.innerHTML = sorted.map(renderPaper).join('');
    } catch (error) {
      container.innerHTML = '<p>Unable to load publications right now.</p>';
      // Optionally log error
      // console.error(error);
    }
  }

  function renderPaper(p) {
    const title = escapeHtml(p.title || 'Untitled');
    const authors = formatAuthors(p.authors);
    const year = p.year ? ` (${escapeHtml(String(p.year))})` : '';
    const links = buildLinks(p);
    const repBadge = p.representative ? `<span class="rep-badge" aria-label="Representative work">Representative</span>` : '';

    return `
      <article class="paper${p.representative ? ' representative' : ''}">
        <h3 class="paper-title">${repBadge} ${title}${year}</h3>
        ${authors ? `<p class="paper-authors">${authors}</p>` : ''}
        ${links ? `<p class="paper-links">${links}</p>` : ''}
      </article>
    `;
  }

  function buildLinks(p) {
    const links = [
      p.url ? `<a href="${encodeURI(p.url)}" target="_blank" rel="noopener">Paper</a>` : null,
      p.code ? `<a href="${encodeURI(p.code)}" target="_blank" rel="noopener">Code</a>` : null,
      p.bibtex ? `<a href="${encodeURI(p.bibtex)}" target="_blank" rel="noopener">bibtex</a>` : null,
    ].filter(Boolean);
    return links.join(' / ');
  }

  function sortByRecency(a, b) {
    const ay = toYear(a.year);
    const by = toYear(b.year);
    return by - ay;
  }

  function toYear(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  function formatAuthors(authorsString) {
    if (!authorsString || typeof authorsString !== 'string') return '';

    const myLastName = 'hopman';
    const authorNames = authorsString.split(';').map(s => s.trim()).filter(Boolean);

    const formatted = authorNames.map(name => {
      const escaped = escapeHtml(name);
      const lower = name.toLowerCase();
      if (lower.includes(myLastName)) {
        return `<strong>${escaped}</strong>`;
      }
      return escaped;
    });

    return formatted.join('; ');
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  document.addEventListener('DOMContentLoaded', loadPapers);
})();



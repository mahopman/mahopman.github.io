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
    const venue = p.venue || p.booktitle || p.journal || '';
    const links = buildLinks(p);
    const repBadge = p.representative ? `<span class="rep-badge" aria-label="Representative work">Representative</span>` : '';

    return `
      <article class="paper${p.representative ? ' representative' : ''}">
        <h3 class="paper-title">${repBadge} ${title}${year}</h3>
        ${authors ? `<p class="paper-authors">${authors}</p>` : ''}
        ${venue ? `<p class="paper-venue"><em>${escapeHtml(venue)}</em></p>` : ''}
        ${links ? `<p class="paper-links">${links}</p>` : ''}
      </article>
    `;
  }

  function buildLinks(p) {
    // If a structured links array is provided, prefer it.
    if (Array.isArray(p.links) && p.links.length > 0) {
      const anchors = p.links
        .map(link => {
          if (!link) return null;
          if (typeof link === 'string') {
            return `<a href="${encodeURI(link)}" target="_blank" rel="noopener">Link</a>`;
          }
          if (typeof link === 'object') {
            const href = typeof link.href === 'string' ? link.href : link.url;
            const rawLabel = link.label || link.text || link.title || 'Link';
            if (!href || typeof href !== 'string') return null;
            return `<a href="${encodeURI(href)}" target="_blank" rel="noopener">${escapeHtml(rawLabel)}</a>`;
          }
          return null;
        })
        .filter(Boolean);
      return anchors.join(' / ');
    }

    // Backwards-compatibility: support legacy top-level properties.
    const legacyLinks = [
      p.url ? `<a href="${encodeURI(p.url)}" target="_blank" rel="noopener">Paper</a>` : null,
      p.code ? `<a href="${encodeURI(p.code)}" target="_blank" rel="noopener">Code</a>` : null,
      p.bibtex ? `<a href="${encodeURI(p.bibtex)}" target="_blank" rel="noopener">bibtex</a>` : null,
    ].filter(Boolean);
    return legacyLinks.join(' / ');
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
      // Convert "Last, First" to "First Last"
      const parts = name.split(',').map(s => s.trim());
      const displayName = parts.length === 2 ? `${parts[1]} ${parts[0]}` : name;
      const escaped = escapeHtml(displayName);
      const lower = name.toLowerCase();
      if (lower.includes(myLastName)) {
        return `<strong>${escaped}</strong>`;
      }
      return escaped;
    });

    return formatted.join(', ');
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



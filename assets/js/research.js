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

      container.innerHTML = items.map(renderPaper).join('');
    } catch (error) {
      container.innerHTML = '<p>Unable to load publications right now.</p>';
      // Optionally log error
      // console.error(error);
    }
  }

  function renderPaper(p) {
    const title = escapeHtml(p.title || 'Untitled');
    const authors = escapeHtml(p.authors || '');
    const year = p.year ? ` (${escapeHtml(String(p.year))})` : '';
    const links = [
      p.url ? `<a href="${encodeURI(p.url)}" target="_blank" rel="noopener">Paper</a>` : null,
      p.code ? `<a href="${encodeURI(p.code)}" target="_blank" rel="noopener">Code</a>` : null,
      p.bibtex ? `<a href="${encodeURI(p.bibtex)}" target="_blank" rel="noopener">bibtex</a>` : null,
    ].filter(Boolean).join(' / ');

    return `
      <article class="paper">
        <h3 class="paper-title">${title}${year}</h3>
        ${authors ? `<p class="paper-authors">${authors}</p>` : ''}
        ${links ? `<p class="paper-links">${links}</p>` : ''}
      </article>
    `;
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



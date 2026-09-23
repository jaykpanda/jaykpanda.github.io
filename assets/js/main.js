const projects = document.querySelector('#projects');

const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[character]));

fetch('https://api.github.com/users/jaykpanda/repos?sort=updated&per_page=100')
  .then((response) => {
    if (!response.ok) throw new Error('GitHub projects are unavailable');
    return response.json();
  })
  .then((repositories) => {
    const featured = repositories
      .filter((repo) => !repo.fork && repo.name !== 'jaykpanda.github.io')
      .sort((a, b) => (b.stargazers_count - a.stargazers_count) || new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 4);

    if (!featured.length) return;
    projects.innerHTML = featured.map((repo, index) => `
      <a class="project" href="${escapeHtml(repo.html_url)}" target="_blank" rel="noreferrer">
        <span class="project-number">${String(index + 1).padStart(2, '0')}</span>
        <div>
          <h3>${escapeHtml(repo.name.replaceAll('-', ' '))}</h3>
          <p>${escapeHtml(repo.description || 'An open-source project on GitHub.')}</p>
          <span class="project-meta">${repo.language ? `<span><i></i>${escapeHtml(repo.language)}</span>` : ''}<span>★ ${repo.stargazers_count}</span></span>
        </div>
        <span class="project-arrow" aria-hidden="true">↗</span>
      </a>`).join('');
  })
  .catch(() => {});

document.querySelector('#year').textContent = new Date().getFullYear();

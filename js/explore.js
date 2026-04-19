// ============================================================
// IdeaNest – Explore Page Logic
// ============================================================

let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', function() {
  filterIdeas();
});

function setFilter(filter, el) {
  currentFilter = filter;
  document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  filterIdeas();
}

function filterIdeas() {
  let ideas = DB.getIdeas();
  const search = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const sort   = document.getElementById('sortSelect')?.value || 'votes';

  // Filter by category
  if (currentFilter !== 'all') {
    ideas = ideas.filter(i => i.category === currentFilter);
  }
  // Filter by search
  if (search) {
    ideas = ideas.filter(i =>
      i.title.toLowerCase().includes(search) ||
      i.desc.toLowerCase().includes(search) ||
      (i.authorName||'').toLowerCase().includes(search)
    );
  }
  // Sort
  if (sort === 'votes')    ideas.sort((a,b) => b.votes - a.votes);
  if (sort === 'newest')   ideas.sort((a,b) => b.createdAt - a.createdAt);
  if (sort === 'comments') ideas.sort((a,b) => (b.comments||[]).length - (a.comments||[]).length);

  const grid = document.getElementById('ideasGrid');
  const noResults = document.getElementById('noResults');
  grid.innerHTML = '';

  if (ideas.length === 0) {
    grid.style.display = 'none';
    noResults.style.display = 'block';
    return;
  }

  grid.style.display = 'grid';
  noResults.style.display = 'none';
  ideas.forEach(idea => grid.appendChild(buildIdeaCard(idea)));
}

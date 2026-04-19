// ============================================================
// IdeaNest – Shared App Utilities
// ============================================================

// Toast notification
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.borderLeftColor = type === 'error' ? 'var(--clr-red)' : type === 'info' ? 'var(--clr-teal)' : 'var(--clr-gold)';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// Populate sidebar user info
function initSidebar() {
  const user = DB.getUser();
  const avatarEl = document.getElementById('sidebarAvatar');
  const nameEl   = document.getElementById('sidebarName');
  const roleEl   = document.getElementById('sidebarRole');
  if (avatarEl) avatarEl.textContent = (user.name || user.email || '?')[0].toUpperCase();
  if (nameEl)   nameEl.textContent   = user.name || user.email || 'Guest';
  if (roleEl)   roleEl.textContent   = (user.role || 'Innovator').charAt(0).toUpperCase() + (user.role || 'innovator').slice(1);
}

// Category → tag class
function categoryTag(cat) {
  const map = { startup:'tag-startup', edtech:'tag-edtech', health:'tag-health', fintech:'tag-fintech', social:'tag-social' };
  return map[cat] || 'tag-other';
}

// Category → emoji
function categoryEmoji(cat) {
  const map = { startup:'🌱', edtech:'🎓', health:'🏥', fintech:'💳', social:'🌍', other:'🔧' };
  return map[cat] || '💡';
}

// Build an idea card element
function buildIdeaCard(idea, showExpand = true) {
  const div = document.createElement('div');
  div.className = 'idea-card';
  const user = DB.getUser();
  const voted = (idea.voters || []).includes(user.email);
  div.innerHTML = `
    <div class="idea-card-header">
      <div class="idea-card-title">${idea.title}</div>
      ${idea.trending ? '<span class="trending-badge">🔥 Trending</span>' : ''}
    </div>
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
      <span class="tag ${categoryTag(idea.category)}">${categoryEmoji(idea.category)} ${idea.category}</span>
      <span class="status status-${idea.stage || 'concept'}">${idea.stage || 'concept'}</span>
    </div>
    <div class="idea-card-desc">${idea.desc}</div>
    <div class="idea-card-meta">
      <div class="author-chip">
        <div class="author-avatar">${(idea.authorName || '?')[0]}</div>
        <span class="author-name">${idea.authorName || 'Anonymous'}</span>
      </div>
      <div class="idea-meta-info">
        <span class="meta-item"><i class="fas fa-chevron-up"></i> ${idea.votes}</span>
        <span class="meta-item"><i class="fas fa-comment"></i> ${(idea.comments || []).length}</span>
      </div>
    </div>
    <div class="idea-card-actions">
      <button class="vote-btn ${voted ? 'voted' : ''}" onclick="voteIdea('${idea.id}',this)">
        <i class="fas fa-chevron-up"></i> <span class="vote-count">${idea.votes}</span>
      </button>
      ${showExpand ? `<button class="action-btn" onclick="openModal('${idea.id}')" title="View Details"><i class="fas fa-expand-alt"></i></button>` : ''}
      <button class="action-btn" onclick="shareIdea('${idea.title}')" title="Share"><i class="fas fa-share-alt"></i></button>
    </div>
  `;
  return div;
}

// Vote on an idea
function voteIdea(id, btn) {
  const user = DB.getUser();
  if (!user.email) { showToast('Please log in to vote!', 'error'); return; }
  const ideas = DB.getIdeas();
  const idea  = ideas.find(i => i.id === id);
  if (!idea) return;
  idea.voters = idea.voters || [];
  if (idea.voters.includes(user.email)) {
    idea.voters = idea.voters.filter(e => e !== user.email);
    idea.votes  = Math.max(0, idea.votes - 1);
    btn && btn.classList.remove('voted');
    showToast('Vote removed.');
  } else {
    idea.voters.push(user.email);
    idea.votes++;
    btn && btn.classList.add('voted');
    showToast('Voted! ⬆️');
  }
  if (btn) btn.querySelector('.vote-count').textContent = idea.votes;
  DB.saveIdeas(ideas);
}

// --- Modal state ---
let currentModalId = null;

function openModal(id) {
  const ideas = DB.getIdeas();
  const idea  = ideas.find(i => i.id === id);
  if (!idea) return;
  currentModalId = id;

  document.getElementById('modalTitle').textContent = idea.title;
  document.getElementById('modalDesc').textContent  = idea.desc + (idea.problem ? '\n\n' + idea.problem : '');
  document.getElementById('modalTeamNeeds').textContent = idea.teamNeeds && idea.teamNeeds.length ? idea.teamNeeds.join(', ') : 'No specific roles listed.';

  const tagsEl = document.getElementById('modalTags');
  tagsEl.innerHTML = `<span class="tag ${categoryTag(idea.category)}">${categoryEmoji(idea.category)} ${idea.category}</span><span class="status status-${idea.stage||'concept'}">${idea.stage||'concept'}</span>`;

  renderModalComments(idea);
  document.getElementById('ideaModal').classList.add('open');
}

function closeModal() {
  document.getElementById('ideaModal').classList.remove('open');
  currentModalId = null;
}

function renderModalComments(idea) {
  const el = document.getElementById('modalComments');
  if (!el) return;
  const comments = idea.comments || [];
  if (comments.length === 0) { el.innerHTML = '<p style="color:var(--clr-muted);font-size:0.85rem">No comments yet. Be the first!</p>'; return; }
  el.innerHTML = comments.map(c => `
    <div class="comment">
      <div class="comment-avatar">${c.author[0]}</div>
      <div class="comment-body">
        <div class="comment-meta">
          <span class="comment-author">${c.author}</span>
          <span class="comment-time">${timeAgo(c.time)}</span>
        </div>
        <div class="comment-text">${c.text}</div>
      </div>
    </div>`).join('');
}

function addComment() {
  const user  = DB.getUser();
  const input = document.getElementById('commentInput');
  const text  = input.value.trim();
  if (!text) return;
  if (!user.email) { showToast('Please log in first!', 'error'); return; }
  const ideas = DB.getIdeas();
  const idea  = ideas.find(i => i.id === currentModalId);
  if (!idea) return;
  idea.comments = idea.comments || [];
  idea.comments.push({ id: 'c_' + Date.now(), author: user.name || user.email, text, time: Date.now() });
  DB.saveIdeas(ideas);
  input.value = '';
  renderModalComments(idea);
  showToast('Comment posted! 💬');
}

function voteFromModal() {
  if (!currentModalId) return;
  const btn = document.getElementById('modalVoteBtn');
  voteIdea(currentModalId, null);
  const ideas = DB.getIdeas();
  const idea  = ideas.find(i => i.id === currentModalId);
  if (idea) btn.innerHTML = `<i class="fas fa-chevron-up"></i> ${idea.votes} Votes`;
}

function shareIdea(title) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(`Check out this idea on IdeaNest: "${title}"`);
    showToast('Link copied to clipboard! 🔗');
  } else {
    showToast('Idea shared! 🔗');
  }
}

function logout() {
  // Keep user data but just navigate away
}

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60)   return 'just now';
  if (s < 3600) return Math.floor(s/60)+'m ago';
  if (s < 86400) return Math.floor(s/3600)+'h ago';
  return Math.floor(s/86400)+'d ago';
}

// Close modal on overlay click
document.addEventListener('click', function(e) {
  const modal = document.getElementById('ideaModal');
  if (modal && e.target === modal) closeModal();
  const pitchModal = document.getElementById('pitchModal');
  if (pitchModal && e.target === pitchModal) closePitchModal && closePitchModal();
});

// Init sidebar on every page
document.addEventListener('DOMContentLoaded', initSidebar);

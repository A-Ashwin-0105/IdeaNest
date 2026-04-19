// ============================================================
// IdeaNest – Submit Idea Logic
// ============================================================

let selectedSkills = [];
let selectedStage  = 'concept';

document.addEventListener('DOMContentLoaded', function() {
  const titleInput = document.getElementById('ideaTitle');
  const descInput  = document.getElementById('ideaDesc');
  if (titleInput) titleInput.addEventListener('input', () => {
    document.getElementById('titleCount').textContent = titleInput.value.length;
  });
  if (descInput) descInput.addEventListener('input', () => {
    document.getElementById('descCount').textContent = descInput.value.length;
  });
});

function selectStage(stage, el) {
  selectedStage = stage;
  document.querySelectorAll('.stage-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('ideaStage').value = stage;
}

function toggleSkill(el, skill) {
  if (selectedSkills.includes(skill)) {
    selectedSkills = selectedSkills.filter(s => s !== skill);
    el.classList.remove('selected');
  } else {
    selectedSkills.push(skill);
    el.classList.add('selected');
  }
}

function updatePreview() {
  const title    = document.getElementById('ideaTitle')?.value || '';
  const desc     = document.getElementById('ideaDesc')?.value  || '';
  const category = document.getElementById('ideaCategory')?.value || '';
  const titleEl  = document.getElementById('previewTitle');
  const descEl   = document.getElementById('previewDesc');
  const tagEl    = document.getElementById('previewTag');
  if (titleEl) { titleEl.textContent = title || 'Your idea title will appear here...'; titleEl.style.color = title ? 'var(--clr-text)' : 'var(--clr-muted)'; }
  if (descEl) descEl.textContent = desc || 'Your description will show up as you type...';
  if (tagEl && category) tagEl.innerHTML = `<span class="tag ${categoryTag(category)}">${categoryEmoji(category)} ${category}</span>`;
  else if (tagEl) tagEl.innerHTML = '';
}

function updateProgress() {
  const fields = [
    document.getElementById('ideaTitle')?.value,
    document.getElementById('ideaCategory')?.value,
    document.getElementById('ideaDesc')?.value,
    document.getElementById('ideaProblem')?.value,
  ];
  const filled = fields.filter(v => v && v.trim()).length;
  const pct = Math.round((filled / fields.length) * 100);
  const bar = document.getElementById('progressFill');
  const txt = document.getElementById('progressText');
  if (bar) bar.style.width = pct + '%';
  if (txt) txt.textContent = pct + '%';
}

function submitIdea() {
  const title    = document.getElementById('ideaTitle')?.value.trim();
  const category = document.getElementById('ideaCategory')?.value;
  const desc     = document.getElementById('ideaDesc')?.value.trim();
  const problem  = document.getElementById('ideaProblem')?.value.trim();
  const market   = document.getElementById('ideaMarket')?.value.trim();
  const budget   = document.getElementById('ideaBudget')?.value;
  const docUrl   = document.getElementById('ideaDoc')?.value.trim();
  const alertEl  = document.getElementById('submitAlert');

  if (!title || !category || !desc) {
    if (alertEl) alertEl.innerHTML = '<div class="alert alert-error">⚠️ Please fill in Title, Category, and Description.</div>';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const user = DB.getUser();
  const idea = {
    id:          'idea_' + Date.now(),
    title, category, desc,
    problem:     problem || '',
    stage:       selectedStage,
    votes:       0, voters: [],
    teamNeeds:   [...selectedSkills],
    authorName:  user.name  || user.email || 'Anonymous',
    authorEmail: user.email || '',
    market: market||'', budget: budget||'', docUrl: docUrl||'',
    comments: [], createdAt: Date.now(), trending: false
  };

  const ideas = DB.getIdeas();
  ideas.unshift(idea);
  DB.saveIdeas(ideas);

  if (alertEl) alertEl.innerHTML = '<div class="alert alert-success">🎉 Idea submitted! Redirecting...</div>';
  setTimeout(() => window.location.href = 'my-ideas.html', 1500);
}

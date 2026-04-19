// ============================================================
// IdeaNest – Investors Page Logic
// ============================================================

let currentInvFilter = 'all';
let currentInvestor  = null;

document.addEventListener('DOMContentLoaded', renderInvestors);

function setInvFilter(filter, el) {
  currentInvFilter = filter;
  document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  filterInvestors();
}

function filterInvestors() {
  const search = (document.getElementById('investorSearch')?.value || '').toLowerCase();
  let investors = DB.getInvestors();
  if (currentInvFilter !== 'all') investors = investors.filter(inv => inv.focus.includes(currentInvFilter));
  if (search) investors = investors.filter(inv =>
    inv.name.toLowerCase().includes(search) || inv.firm.toLowerCase().includes(search)
  );
  renderInvestorCards(investors);
}

function renderInvestors() { renderInvestorCards(DB.getInvestors()); }

function renderInvestorCards(investors) {
  const grid = document.getElementById('investorsGrid');
  if (!grid) return;
  if (investors.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--clr-muted)"><div style="font-size:3rem;margin-bottom:12px">🔍</div><p>No investors match your filter.</p></div>`;
    return;
  }
  grid.innerHTML = investors.map(inv => `
    <div class="investor-card">
      <div class="investor-avatar">${inv.initials}</div>
      <div><div class="investor-name">${inv.name}</div><div class="investor-firm">${inv.firm}</div></div>
      <p style="font-size:0.82rem;color:var(--clr-soft);line-height:1.6;text-align:center">${inv.bio}</p>
      <div class="investor-focus">${inv.focus.map(f => `<span class="tag tag-${f}">${categoryEmoji(f)} ${f}</span>`).join('')}</div>
      <div class="investor-stats-row">
        <div class="investor-stat" style="flex:1"><div class="investor-stat-num">${inv.portfolio}</div><div class="investor-stat-label">Portfolio</div></div>
        <div class="investor-stat" style="flex:1"><div class="investor-stat-num">${inv.exits}</div><div class="investor-stat-label">Exits</div></div>
      </div>
      <div style="font-size:0.78rem;color:var(--clr-muted);text-align:center">Ticket: <strong style="color:var(--clr-text)">${inv.minTicket} – ${inv.maxTicket}</strong></div>
      <button class="btn btn-gold" style="width:100%;justify-content:center" onclick="openPitchModal('${inv.id}')"><i class="fas fa-paper-plane"></i> Send Pitch</button>
    </div>`).join('');
}

function openPitchModal(investorId) {
  const user = DB.getUser();
  if (!user.email) { showToast('Please log in to send a pitch!', 'error'); return; }
  const investors = DB.getInvestors();
  currentInvestor = investors.find(i => i.id === investorId);
  if (!currentInvestor) return;
  const targetEl = document.getElementById('pitchTarget');
  if (targetEl) targetEl.innerHTML = `
    <div class="investor-avatar" style="width:46px;height:46px;font-size:1rem">${currentInvestor.initials}</div>
    <div><div style="font-weight:700">${currentInvestor.name}</div><div style="font-size:0.8rem;color:var(--clr-muted)">${currentInvestor.firm}</div></div>`;
  const ideas = DB.getIdeas().filter(i => i.authorEmail === user.email);
  const select = document.getElementById('pitchIdeaSelect');
  if (select) {
    select.innerHTML = '<option value="">Choose an idea to pitch...</option>';
    ideas.forEach(i => { const opt = document.createElement('option'); opt.value = i.id; opt.textContent = i.title; select.appendChild(opt); });
  }
  document.getElementById('pitchModal').classList.add('open');
}

function closePitchModal() {
  document.getElementById('pitchModal').classList.remove('open');
  currentInvestor = null;
}

function sendPitch() {
  const ideaId  = document.getElementById('pitchIdeaSelect')?.value;
  const message = document.getElementById('pitchMessage')?.value.trim();
  const deckUrl = document.getElementById('pitchDeckUrl')?.value.trim();
  if (!ideaId)  { showToast('Please select an idea!', 'error'); return; }
  if (!message) { showToast('Please write a message!', 'error'); return; }
  const pitches = JSON.parse(localStorage.getItem('ideaNestPitches') || '[]');
  pitches.push({ id:'pitch_'+Date.now(), investorId:currentInvestor?.id, investorName:currentInvestor?.name, ideaId, message, deckUrl, sentAt:Date.now(), status:'sent' });
  localStorage.setItem('ideaNestPitches', JSON.stringify(pitches));
  closePitchModal();
  showToast(`Pitch sent to ${currentInvestor?.name}! 🚀`);
  if (document.getElementById('pitchMessage')) document.getElementById('pitchMessage').value = '';
  if (document.getElementById('pitchDeckUrl')) document.getElementById('pitchDeckUrl').value = '';
}

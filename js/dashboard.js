// ============================================================
// IdeaNest – Dashboard Logic
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
  loadDashboard();
});

function loadDashboard() {
  const user  = DB.getUser();
  const ideas = DB.getIdeas();
  const mine  = ideas.filter(i => i.authorEmail === user.email);

  // Stats
  const totalVotes = mine.reduce((s,i) => s + (i.votes||0), 0);
  const totalComments = mine.reduce((s,i) => s + (i.comments||[]).length, 0);
  animateCount('statMyIdeas',     mine.length);
  animateCount('statVotesReceived', totalVotes);
  animateCount('statComments',    totalComments);
  animateCount('statCollabs',     mine.filter(i => i.teamNeeds && i.teamNeeds.length).length);

  // Trending ideas
  const trending = [...ideas].sort((a,b) => b.votes - a.votes).slice(0, 4);
  const trendingEl = document.getElementById('trendingIdeas');
  trendingEl.innerHTML = '';
  trending.forEach(idea => trendingEl.appendChild(buildIdeaCard(idea)));

  // Recent activity
  renderActivity();

  // Top categories
  renderCategories(ideas);
}

function animateCount(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let current = 0;
  const step = Math.ceil(target / 30);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 30);
}

function renderActivity() {
  const el = document.getElementById('recentActivity');
  if (!el) return;
  const ideas = DB.getIdeas();
  const activity = [];

  ideas.slice(0,3).forEach(idea => {
    activity.push({ icon:'💡', text:`"${idea.title.slice(0,28)}..." submitted`, time: idea.createdAt });
    if (idea.comments && idea.comments.length) {
      const last = idea.comments[idea.comments.length-1];
      activity.push({ icon:'💬', text:`${last.author} commented on "${idea.title.slice(0,20)}..."`, time: last.time });
    }
  });

  activity.sort((a,b) => b.time - a.time);
  el.innerHTML = activity.slice(0,5).map(a => `
    <div style="display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--clr-border)">
      <span style="font-size:1rem">${a.icon}</span>
      <div>
        <div style="font-size:0.82rem">${a.text}</div>
        <div style="font-size:0.72rem;color:var(--clr-muted);margin-top:2px">${timeAgo(a.time)}</div>
      </div>
    </div>`).join('') || '<p style="font-size:0.82rem;color:var(--clr-muted)">No recent activity.</p>';
}

function renderCategories(ideas) {
  const el = document.getElementById('topCategories');
  if (!el) return;
  const cats = {};
  ideas.forEach(i => { cats[i.category] = (cats[i.category]||0) + 1; });
  const sorted = Object.entries(cats).sort((a,b) => b[1]-a[1]);
  const max = sorted[0]?.[1] || 1;
  el.innerHTML = sorted.map(([cat, count]) => `
    <div style="margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:4px">
        <span>${categoryEmoji(cat)} ${cat}</span><span style="color:var(--clr-muted)">${count} idea${count>1?'s':''}</span>
      </div>
      <div style="height:5px;background:var(--clr-border);border-radius:99px;overflow:hidden">
        <div style="height:100%;width:${(count/max)*100}%;background:linear-gradient(90deg,var(--clr-gold),var(--clr-amber));border-radius:99px;transition:width 0.8s ease"></div>
      </div>
    </div>`).join('');
}

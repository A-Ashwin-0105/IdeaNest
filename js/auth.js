// ============================================================
// IdeaNest – Auth Logic
// ============================================================

function showAlert(containerId, msg, type = 'error') {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `<div class="alert alert-${type}">${msg}</div>`;
}

function handleLogin() {
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    showAlert('loginAlert', '⚠️ Please fill in all fields.');
    return;
  }

  // Demo: accept any email with password "demo123", or check stored user
  const stored = JSON.parse(localStorage.getItem('ideaNestRegistered') || '[]');
  const found  = stored.find(u => u.email === email && u.password === password);

  if (!found && password !== 'demo123') {
    showAlert('loginAlert', '❌ Invalid credentials. Try demo password: demo123');
    return;
  }

  const user = found || {
    email,
    name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
    role: 'innovator',
    firstName: email.split('@')[0],
    lastName: ''
  };

  localStorage.setItem('ideaNestUser', JSON.stringify(user));
  window.location.href = 'dashboard.html';
}

function handleRegister() {
  const firstName = document.getElementById('firstName').value.trim();
  const lastName  = document.getElementById('lastName').value.trim();
  const email     = document.getElementById('regEmail').value.trim();
  const password  = document.getElementById('regPassword').value;
  const bio       = document.getElementById('regBio').value.trim();
  const role      = document.getElementById('selectedRole').value;

  if (!firstName || !email || !password) {
    showAlert('registerAlert', '⚠️ Please fill in all required fields.');
    return;
  }
  if (password.length < 6) {
    showAlert('registerAlert', '⚠️ Password must be at least 6 characters.');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showAlert('registerAlert', '⚠️ Please enter a valid email address.');
    return;
  }

  const user = {
    email,
    password,
    firstName,
    lastName,
    name: `${firstName} ${lastName}`.trim(),
    role,
    bio,
    createdAt: Date.now()
  };

  // Store in registered list
  const registered = JSON.parse(localStorage.getItem('ideaNestRegistered') || '[]');
  const exists = registered.find(u => u.email === email);
  if (exists) {
    showAlert('registerAlert', '⚠️ This email is already registered. <a href="login.html" style="color:var(--clr-gold)">Sign in instead.</a>');
    return;
  }
  registered.push(user);
  localStorage.setItem('ideaNestRegistered', JSON.stringify(registered));

  // Log them in
  localStorage.setItem('ideaNestUser', JSON.stringify(user));
  showAlert('registerAlert', '🎉 Account created! Redirecting...', 'success');
  setTimeout(() => window.location.href = 'dashboard.html', 1200);
}

function selectRole(role, el) {
  document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('selectedRole').value = role;
}

function socialLogin(provider) {
  // Simulate social login
  const user = {
    email: `demo+${provider.toLowerCase()}@ideanest.io`,
    name: `${provider} User`,
    firstName: provider,
    lastName: 'User',
    role: 'innovator',
    bio: `Signed in with ${provider}`
  };
  localStorage.setItem('ideaNestUser', JSON.stringify(user));
  window.location.href = 'dashboard.html';
}

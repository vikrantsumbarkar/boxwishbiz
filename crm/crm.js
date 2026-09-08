const loginView = document.getElementById('loginView');
const appView = document.getElementById('appView');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const sidebar = document.getElementById('sidebar');
const menuBtn = document.getElementById('menuBtn');
const pageTitle = document.getElementById('pageTitle');
const toast = document.getElementById('toast');

const pageNames = {
  dashboard: 'Dashboard', enquiries: 'Enquiries', clients: 'Clients', quotations: 'Quotations',
  fir: 'FIR', lpa: 'LPA', sas: 'SAS', orders: 'Orders', followups: 'Follow Ups', documents: 'Documents', profile: 'Profile'
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

function navigate(page) {
  const target = pageNames[page] ? page : 'dashboard';
  document.querySelectorAll('.page').forEach(el => el.classList.toggle('active-page', el.id === target));
  document.querySelectorAll('.nav-item[data-page]').forEach(el => el.classList.toggle('active', el.dataset.page === target));
  pageTitle.textContent = pageNames[target];
  history.replaceState(null, '', `#${target}`);
  sidebar.classList.remove('open');
}

function openApp(user) {
  loginView.classList.add('hidden');
  appView.classList.remove('hidden');
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userRole').textContent = user.role;
  document.getElementById('profileId').textContent = user.id;
  document.getElementById('profileName').textContent = user.name;
  document.getElementById('profileRole').textContent = user.role;
  navigate(location.hash.replace('#', '') || 'dashboard');
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const id = document.getElementById('employeeId').value.trim();
  const password = document.getElementById('password').value;
  if (!id || !password) return;

  // Temporary development login only. Real authentication will be backend-based.
  const user = { id, name: id, role: 'Sales' };
  sessionStorage.setItem('crmDevUser', JSON.stringify(user));
  openApp(user);
  showToast('Signed in (development mode)');
});

logoutBtn.addEventListener('click', () => {
  sessionStorage.removeItem('crmDevUser');
  appView.classList.add('hidden');
  loginView.classList.remove('hidden');
  loginForm.reset();
  history.replaceState(null, '', '#dashboard');
  showToast('Signed out');
});

document.addEventListener('click', (event) => {
  const pageLink = event.target.closest('[data-page]');
  if (pageLink) {
    event.preventDefault();
    navigate(pageLink.dataset.page);
    return;
  }

  const action = event.target.closest('[data-action]');
  if (action?.dataset.action === 'new-enquiry') {
    navigate('enquiries');
    showToast('Enquiry form will be added next');
  }
});

menuBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
window.addEventListener('hashchange', () => {
  if (!appView.classList.contains('hidden')) navigate(location.hash.replace('#', ''));
});

const savedUser = sessionStorage.getItem('crmDevUser');
if (savedUser) {
  try { openApp(JSON.parse(savedUser)); } catch { sessionStorage.removeItem('crmDevUser'); }
}

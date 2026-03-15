// ========== AUTHENTICATION ==========

let currentUser = null;

// Helper: Show Error
function showError(boxId, message) {
  const errorBox = document.getElementById(boxId);
  if (errorBox) {
    errorBox.textContent = message;
    errorBox.classList.add('show');
  }
}

function hideError(boxId) {
  const errorBox = document.getElementById(boxId);
  if (errorBox) {
    errorBox.textContent = '';
    errorBox.classList.remove('show');
  }
}

// Login Form Handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError('loginError');

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
      showError('loginError', 'Please enter email and password');
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          user: { email, password }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        showError('loginError', data.message || 'Login failed');
        return;
      }

      // Login successful
      window.location.href = 'map.html';
      
    } catch (err) {
      console.error(err);
      showError('loginError', 'Server error during login.');
    }
  });
}

// Signup Form Handler
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError('signupError');

    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirm').value;

    if (!name || !email || !password || !confirm) {
      showError('signupError', 'Please fill in all fields');
      return;
    }

    if (password !== confirm) {
      showError('signupError', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      showError('signupError', 'Password must be at least 6 characters');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          user: { email, username: name, password }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        showError('signupError', data.message || 'Registration failed');
        return;
      }

      window.location.href = 'map.html';

    } catch (err) {
      console.error(err);
      showError('signupError', 'Server error during registration.');
    }
  });
}

// Logout Handler
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout failed', e);
    }
    window.location.href = 'index.html';
  });
}

// Check if already logged in (Frontend Guard)
window.addEventListener('DOMContentLoaded', async () => {
  const isMapPage = window.location.pathname.endsWith('map.html');
  
  try {
    const response = await fetch('/api/auth/me', {
      credentials: 'include'
    });
    
    if (response.ok) {
      const data = await response.json();
      currentUser = data.user;
      
      // If they are on the landing/login/register pages and logged in, push to map
      if (!isMapPage) {
        window.location.href = 'map.html';
      }
    } else {
      // Not logged in or token expired
      throw new Error('Not authenticated');
    }
  } catch (err) {
    currentUser = null;
    // If they are on map.html but not logged in, boot them out
    if (isMapPage) {
      window.location.href = 'index.html';
    }
  }
});

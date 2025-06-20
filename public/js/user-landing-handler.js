import { checkAuthStatus, logoutUser } from './auth.js';

window.addEventListener('DOMContentLoaded', async () => {
  const welcomeMessage = document.getElementById('welcome-message');
  const userDetailsContainer = document.getElementById('user-details');
  const logoutButton = document.getElementById('logout-button');

  // Fetch user info from session
  const authStatus = await checkAuthStatus();

  if (authStatus.isAuthenticated && authStatus.user) {
    // Welcome message
    welcomeMessage.textContent = `Hello, ${authStatus.user.displayName || 'User'}!`;

    // Display user details, excluding UID and password
    userDetailsContainer.innerHTML = `
      <p><strong>Email:</strong> ${authStatus.user.email || 'Not available'}</p>
      <p><strong>Display Name:</strong> ${authStatus.user.displayName || 'Not available'}</p>
      <p><strong>Role:</strong> ${authStatus.user.role || 'Not available'}</p>
    `;
    logoutButton.style.display = '';
  } else {
    welcomeMessage.textContent = 'Hello!';
    userDetailsContainer.innerHTML = '<p>User data not found. Please <a href="/login">log in</a>.</p>';
    logoutButton.style.display = 'none';
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', async (e) => {
      e.preventDefault();
      const result = await logoutUser();
      if (!result.error) {
        window.location.href = '/';
      } else {
        alert('Logout failed. Please try again.');
      }
    });
  }
}); 
import { removeAuthToken } from './auth.js';

window.addEventListener('DOMContentLoaded', () => {
  const welcomeMessage = document.getElementById('welcome-message');
  const userDetailsContainer = document.getElementById('user-details');
  const logoutButton = document.getElementById('logout-button');

  const userData = JSON.parse(localStorage.getItem('user'));

  if (userData) {
    // Welcome message
    welcomeMessage.textContent = `Hello, ${userData.displayName || 'User'}!`;

    // Display user details, excluding UID and password
    userDetailsContainer.innerHTML = `
      <p><strong>Email:</strong> ${userData.email || 'Not available'}</p>
      <p><strong>Display Name:</strong> ${userData.displayName || 'Not available'}</p>
      <p><strong>Role:</strong> ${userData.role || 'Not available'}</p>
    `;
  } else {
    welcomeMessage.textContent = 'Hello!';
    userDetailsContainer.innerHTML = '<p>User data not found. Please <a href="/login">log in</a>.</p>';
    logoutButton.style.display = 'none';
  }

  logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    // Remove the auth token and user data from storage
    removeAuthToken();
    localStorage.removeItem('user');
    // Redirect to the login page
    window.location.href = '/login';
  });
}); 
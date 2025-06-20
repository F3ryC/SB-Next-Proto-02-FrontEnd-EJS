import { loginUser } from './auth.js';

// Wait for the DOM to be fully loaded
window.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.login-form');
  if (!form) return;

  // Create or select error/success message containers
  let errorDiv = document.querySelector('.alert-error');
  let successDiv = document.querySelector('.alert-success');

  // If not present, create them dynamically
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-error';
    errorDiv.style.display = 'none';
    form.prepend(errorDiv);
  }
  if (!successDiv) {
    successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success';
    successDiv.style.display = 'none';
    form.prepend(successDiv);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    // Collect form data
    const formData = new FormData(form);
    const credentials = {
      username: formData.get('username'), // or email
      password: formData.get('password'),
    };

    // Call loginUser
    const result = await loginUser(credentials);

    // Handle response
    if (result.error || !result.user) {
      errorDiv.textContent = result.message || result.error || 'Login failed.';
      errorDiv.style.display = 'block';
    } else {
      // User data is now in the session, no need to store it in localStorage.
      // The backend has set an HttpOnly cookie for session management.
      successDiv.textContent = 'Login successful! Redirecting...';
      successDiv.style.display = 'block';
      form.reset();
      // Optionally redirect after a short delay
      setTimeout(() => { window.location.href = '/user-landing'; }, 1000);
    }
  });
}); 
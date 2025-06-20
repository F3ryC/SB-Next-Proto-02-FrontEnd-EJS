import { registerUser } from './auth.js';

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
    const userData = {
      username: formData.get('username'),
      displayName: formData.get('displayName') || formData.get('username'), // Ensure displayName is sent
      email: formData.get('email'),
      password: formData.get('password'),
    };

    // Call registerUser
    const result = await registerUser(userData);

    // Handle response
    if (result.error || !result.user) {
      errorDiv.textContent = result.message || result.error || 'Registration failed.';
      errorDiv.style.display = 'block';
    } else {
      // User is now logged in via session cookie
      successDiv.textContent = 'Registration successful! Redirecting...';
      successDiv.style.display = 'block';
      form.reset();
      // Redirect to a landing page
      setTimeout(() => { window.location.href = '/user-landing'; }, 1000);
    }
  });
}); 
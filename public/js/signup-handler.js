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
      email: formData.get('email'),
      password: formData.get('password'),
      // Add role or name if needed
    };

    // Call registerUser
    const result = await registerUser(userData);

    // Handle response
    if (result.error || result.message === 'Error registering user') {
      errorDiv.textContent = result.error || result.message || 'Registration failed.';
      errorDiv.style.display = 'block';
    } else {
      successDiv.textContent = 'Registration successful! Please log in.';
      successDiv.style.display = 'block';
      form.reset();
    }
  });
}); 
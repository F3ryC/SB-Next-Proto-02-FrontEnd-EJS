import { registerUser } from './auth.js';
import { showLoading, handleApiResponse, MESSAGE_TEMPLATES, clearMessages } from './messaging.js';

// Wait for the DOM to be fully loaded
window.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.login-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear any existing messages
    clearMessages('.login-form-container');
    
    // Show loading state
    const loadingMessage = showLoading('.login-form-container');
    
    // Disable form during submission
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Creating Account...';

    try {
      // Collect form data
      const formData = new FormData(form);
      const userData = {
        username: formData.get('username'),
        displayName: formData.get('name') || formData.get('username'), // Use 'name' field from form
        email: formData.get('email'),
        password: formData.get('password'),
      };

      // Validate required fields
      if (!userData.email || !userData.password || !userData.displayName) {
        throw new Error(MESSAGE_TEMPLATES.VALIDATION_ERROR);
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        throw new Error(MESSAGE_TEMPLATES.INVALID_EMAIL);
      }

      // Validate password strength
      if (userData.password.length < 6) {
        throw new Error(MESSAGE_TEMPLATES.WEAK_PASSWORD);
      }

      // Call registerUser
      const result = await registerUser(userData);

      // Handle response using standardized messaging
      const success = handleApiResponse(result, '.login-form-container', {
        success: MESSAGE_TEMPLATES.REGISTRATION_SUCCESS,
        error: result.message || MESSAGE_TEMPLATES.REGISTRATION_ERROR
      });

      if (success) {
        // Reset form on success
        form.reset();
        
        // Redirect to user landing page after a short delay
        setTimeout(() => {
          window.location.href = 'http://app.localhost:3000/user-landing';
        }, 2000);
      }

    } catch (error) {
      // Handle network errors or validation errors
      const errorMessage = error.message || MESSAGE_TEMPLATES.NETWORK_ERROR;
      handleApiResponse({ error: errorMessage }, '.login-form-container', {
        error: errorMessage
      });
    } finally {
      // Re-enable form
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
      
      // Remove loading message
      if (loadingMessage) {
        loadingMessage.remove();
      }
    }
  });
}); 
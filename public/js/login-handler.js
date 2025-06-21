import { loginUser } from './auth.js';
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
    submitButton.textContent = 'Signing In...';

    try {
      // Collect form data
      const formData = new FormData(form);
      const credentials = {
        username: formData.get('username'), // or email
        password: formData.get('password'),
      };

      // Validate required fields
      if (!credentials.username || !credentials.password) {
        throw new Error(MESSAGE_TEMPLATES.VALIDATION_ERROR);
      }

      // Call loginUser
      const result = await loginUser(credentials);

      // Handle response using standardized messaging
      const success = handleApiResponse(result, '.login-form-container', {
        success: MESSAGE_TEMPLATES.LOGIN_SUCCESS,
        error: result.message || MESSAGE_TEMPLATES.LOGIN_ERROR
      });

      if (success) {
        // Reset form on success
        form.reset();
        
        // Redirect to user landing page after a short delay
        setTimeout(() => {
          window.location.href = '/user-landing';
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
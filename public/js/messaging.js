// messaging.js - Standardized messaging system for forms and pages
// Provides consistent error and success message display across the application

/**
 * Message types for consistent styling
 */
export const MESSAGE_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

/**
 * Standard message templates for common scenarios
 */
export const MESSAGE_TEMPLATES = {
  // Registration messages
  REGISTRATION_SUCCESS: 'Account created successfully! Welcome to Sproutbeat!',
  REGISTRATION_ERROR: 'Registration failed. Please check your information and try again.',
  EMAIL_EXISTS: 'An account with this email already exists. Please try logging in instead.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  WEAK_PASSWORD: 'Password must be at least 6 characters long.',
  
  // Login messages
  LOGIN_SUCCESS: 'Welcome back! Redirecting to your dashboard...',
  LOGIN_ERROR: 'Login failed. Please check your credentials and try again.',
  INVALID_CREDENTIALS: 'Invalid username or password. Please try again.',
  ACCOUNT_LOCKED: 'Account temporarily locked. Please try again later.',
  
  // General messages
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  
  // Loading states
  PROCESSING: 'Processing your request...',
  LOADING: 'Loading...'
};

/**
 * Create a standardized message element
 * @param {string} message - The message text
 * @param {string} type - Message type (success, error, warning, info)
 * @param {boolean} dismissible - Whether the message can be dismissed
 * @returns {HTMLElement} The message element
 */
export function createMessageElement(message, type = MESSAGE_TYPES.INFO, dismissible = true) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `alert alert-${type}`;
  
  // Add icon based on message type
  const icon = getMessageIcon(type);
  
  messageDiv.innerHTML = `
    <div class="alert-content">
      <i class="alert-icon">${icon}</i>
      <span class="alert-text">${message}</span>
    </div>
    ${dismissible ? '<button class="alert-dismiss" aria-label="Dismiss message">×</button>' : ''}
  `;
  
  // Add dismiss functionality
  if (dismissible) {
    const dismissBtn = messageDiv.querySelector('.alert-dismiss');
    dismissBtn.addEventListener('click', () => {
      hideMessage(messageDiv);
    });
  }
  
  return messageDiv;
}

/**
 * Get appropriate icon for message type
 * @param {string} type - Message type
 * @returns {string} Icon (emoji or FontAwesome class)
 */
function getMessageIcon(type) {
  const icons = {
    [MESSAGE_TYPES.SUCCESS]: '✅',
    [MESSAGE_TYPES.ERROR]: '❌',
    [MESSAGE_TYPES.WARNING]: '⚠️',
    [MESSAGE_TYPES.INFO]: 'ℹ️'
  };
  return icons[type] || icons[MESSAGE_TYPES.INFO];
}

/**
 * Show a message in a container
 * @param {string} message - The message text
 * @param {string} type - Message type
 * @param {string|HTMLElement} container - Container element or selector
 * @param {boolean} dismissible - Whether the message can be dismissed
 * @param {number} autoHide - Auto-hide after milliseconds (0 = no auto-hide)
 */
export function showMessage(message, type = MESSAGE_TYPES.INFO, container = 'body', dismissible = true, autoHide = 0) {
  const messageElement = createMessageElement(message, type, dismissible);
  
  // Find container
  const targetContainer = typeof container === 'string' 
    ? document.querySelector(container) 
    : container;
  
  if (!targetContainer) {
    console.error('Message container not found:', container);
    return null;
  }
  
  // Clear existing messages of the same type
  clearMessages(targetContainer, type);
  
  // Insert message at the top of the container
  targetContainer.insertBefore(messageElement, targetContainer.firstChild);
  
  // Add animation class
  setTimeout(() => {
    messageElement.classList.add('alert-show');
  }, 10);
  
  // Auto-hide if specified
  if (autoHide > 0) {
    setTimeout(() => {
      hideMessage(messageElement);
    }, autoHide);
  }
  
  return messageElement;
}

/**
 * Hide a specific message element
 * @param {HTMLElement} messageElement - The message element to hide
 */
export function hideMessage(messageElement) {
  if (!messageElement) return;
  
  messageElement.classList.add('alert-hide');
  setTimeout(() => {
    if (messageElement.parentNode) {
      messageElement.parentNode.removeChild(messageElement);
    }
  }, 300); // Match CSS transition duration
}

/**
 * Clear all messages or messages of a specific type
 * @param {string|HTMLElement} container - Container element or selector
 * @param {string} type - Optional message type to clear
 */
export function clearMessages(container = 'body', type = null) {
  const targetContainer = typeof container === 'string' 
    ? document.querySelector(container) 
    : container;
  
  if (!targetContainer) return;
  
  const selector = type 
    ? `.alert-${type}` 
    : '.alert';
  
  const messages = targetContainer.querySelectorAll(selector);
  messages.forEach(message => {
    hideMessage(message);
  });
}

/**
 * Show success message
 * @param {string} message - Success message
 * @param {string|HTMLElement} container - Container element or selector
 * @param {number} autoHide - Auto-hide after milliseconds
 */
export function showSuccess(message, container = 'body', autoHide = 5000) {
  return showMessage(message, MESSAGE_TYPES.SUCCESS, container, true, autoHide);
}

/**
 * Show error message
 * @param {string} message - Error message
 * @param {string|HTMLElement} container - Container element or selector
 * @param {number} autoHide - Auto-hide after milliseconds (0 = no auto-hide)
 */
export function showError(message, container = 'body', autoHide = 0) {
  return showMessage(message, MESSAGE_TYPES.ERROR, container, true, autoHide);
}

/**
 * Show warning message
 * @param {string} message - Warning message
 * @param {string|HTMLElement} container - Container element or selector
 * @param {number} autoHide - Auto-hide after milliseconds
 */
export function showWarning(message, container = 'body', autoHide = 8000) {
  return showMessage(message, MESSAGE_TYPES.WARNING, container, true, autoHide);
}

/**
 * Show info message
 * @param {string} message - Info message
 * @param {string|HTMLElement} container - Container element or selector
 * @param {number} autoHide - Auto-hide after milliseconds
 */
export function showInfo(message, container = 'body', autoHide = 6000) {
  return showMessage(message, MESSAGE_TYPES.INFO, container, true, autoHide);
}

/**
 * Show loading message
 * @param {string|HTMLElement} container - Container element or selector
 * @returns {HTMLElement} The loading message element
 */
export function showLoading(container = 'body') {
  return showMessage(MESSAGE_TEMPLATES.PROCESSING, MESSAGE_TYPES.INFO, container, false, 0);
}

/**
 * Handle API response and show appropriate message
 * @param {Object} response - API response object
 * @param {string|HTMLElement} container - Container element or selector
 * @param {Object} customMessages - Custom message overrides
 * @returns {boolean} Whether the response was successful
 */
export function handleApiResponse(response, container = 'body', customMessages = {}) {
  if (response.error || !response.user) {
    const errorMessage = response.message || response.error || customMessages.error || MESSAGE_TEMPLATES.UNKNOWN_ERROR;
    showError(errorMessage, container);
    return false;
  } else {
    const successMessage = customMessages.success || MESSAGE_TEMPLATES.REGISTRATION_SUCCESS;
    showSuccess(successMessage, container);
    return true;
  }
} 
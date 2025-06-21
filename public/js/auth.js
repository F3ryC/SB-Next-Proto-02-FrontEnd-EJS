// auth.js - Handles authentication-related API calls.
// For use in EJS frontend. All business logic is in the backend API.
// The backend uses HttpOnly cookies for session management, so no token handling is needed here.

const API_BASE_URL = 'http://localhost:4000/api';

/**
 * Register a new user (public endpoint)
 * @param {Object} userData - { username, email, password, displayName, role }
 * @returns {Promise<Object>} API response
 */
export async function registerUser(userData) {
  try {
    // Compose payload for /auth/signup
    const payload = {
      email: userData.email,
      password: userData.password,
      displayName: userData.name || userData.displayName || userData.username,
      username: userData.username,
      role: userData.role
    };
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include'
    });
    return await response.json();
  } catch (err) {
    return { error: err.message || 'Network error. Please try again.' };
  }
}

/**
 * Log in a user using Firebase Authentication
 * @param {Object} credentials - { username/email, password }
 * @returns {Promise<Object>} API response
 */
export async function loginUser(credentials) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'include'
    });
    // No token management needed, the browser handles the session cookie automatically.
    return await response.json();
  } catch (err) {
    return { error: err.message || 'Login failed. Please try again.' };
  }
}

/**
 * Logs out the current user by destroying the server session.
 * @returns {Promise<Object>} API response
 */
export async function logoutUser() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
    return await response.json();
  } catch (err) {
    return { error: err.message || 'Logout failed. Please try again.' };
  }
}

/**
 * Checks the user's authentication status with the backend.
 * @returns {Promise<Object>} API response containing user data if authenticated
 */
export async function checkAuthStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/status`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
    // Note: A 401 error is expected after logout or when not authenticated.
    // This is handled gracefully here, but the browser will still log the failed request in DevTools.
    if (response.status === 401) {
      // Not authenticated
      return { isAuthenticated: false };
    }
    return await response.json();
  } catch (err) {
    return { isAuthenticated: false, error: err.message || 'Network error.' };
  }
}

/**
 * Request a password reset for the given email
 * @param {string} email - User's email address
 * @returns {Promise<Object>} API response
 */
export async function requestPasswordReset(email) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      credentials: 'include'
    });
    return await response.json();
  } catch (err) {
    return { error: err.message || 'Failed to request password reset. Please try again.' };
  }
}

/**
 * Reset password using the reset code from email
 * @param {string} oobCode - Reset code from email link
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} API response
 */
export async function resetPassword(oobCode, newPassword) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oobCode, newPassword }),
      credentials: 'include'
    });
    return await response.json();
  } catch (err) {
    return { error: err.message || 'Failed to reset password. Please try again.' };
  }
}

/**
 * Send email verification link to user
 * @param {string} email - User's email address
 * @returns {Promise<Object>} API response
 */
export async function sendVerificationEmail(email) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/send-verification-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      credentials: 'include'
    });
    return await response.json();
  } catch (err) {
    return { error: err.message || 'Failed to send verification email. Please try again.' };
  }
}

/**
 * Verify email using the verification code from email
 * @param {string} oobCode - Verification code from email link
 * @returns {Promise<Object>} API response
 */
export async function verifyEmail(oobCode) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oobCode }),
      credentials: 'include'
    });
    return await response.json();
  } catch (err) {
    return { error: err.message || 'Failed to verify email. Please try again.' };
  }
}

// Add more functions as needed for password reset, email verification, etc. 
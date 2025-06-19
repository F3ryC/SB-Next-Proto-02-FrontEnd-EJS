// auth.js - Handles authentication-related API calls and token management
// For use in EJS frontend. All business logic is in the backend API.
// Uses localStorage for token management (can be improved to HttpOnly cookies in the future).

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
      body: JSON.stringify(payload)
    });
    return await response.json();
  } catch (err) {
    return { error: 'Network error. Please try again.' };
  }
}

/**
 * Log in a user
 * @param {Object} credentials - { username/email, password }
 * @returns {Promise<Object>} API response (should include token)
 */
export async function loginUser(credentials) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await response.json();
    if (response.ok && data.token) {
      setAuthToken(data.token);
    }
    return data;
  } catch (err) {
    return { error: 'Network error. Please try again.' };
  }
}

/**
 * Store JWT or session token in localStorage
 * @param {string} token
 */
export function setAuthToken(token) {
  localStorage.setItem('authToken', token);
}

/**
 * Retrieve JWT or session token from localStorage
 * @returns {string|null}
 */
export function getAuthToken() {
  return localStorage.getItem('authToken');
}

/**
 * Remove JWT or session token from localStorage
 */
export function removeAuthToken() {
  localStorage.removeItem('authToken');
}

// Add more functions as needed for password reset, email verification, etc. 
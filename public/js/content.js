// content.js - Handles fetching and displaying content from the backend API
// For use in EJS frontend. All business logic is in the backend API.

const API_BASE_URL = 'http://localhost:4000/api';

/**
 * Fetch all available content from the backend API
 * @returns {Promise<Object>} API response containing content array
 */
export async function fetchAllContent() {
  try {
    const response = await fetch(`${API_BASE_URL}/content`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (err) {
    console.error('Error fetching content:', err);
    return { error: err.message || 'Failed to fetch content' };
  }
}

/**
 * Fetch content by ID from the backend API
 * @param {string} contentId - The ID of the content to fetch
 * @returns {Promise<Object>} API response containing content object
 */
export async function fetchContentById(contentId) {
  try {
    const response = await fetch(`${API_BASE_URL}/content/${contentId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (err) {
    console.error('Error fetching content by ID:', err);
    return { error: err.message || 'Failed to fetch content' };
  }
}

/**
 * Display content in a modern, engaging, and kid-friendly way
 * @param {Array} content - Array of content objects from the API
 * @param {string} containerId - ID of the DOM element to populate
 */
export function displayContent(content, containerId = 'content-container') {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('Content container not found:', containerId);
    return;
  }

  if (!Array.isArray(content) || content.length === 0) {
    container.innerHTML = `
      <div class="no-content">
        <div class="no-content-icon">🎵</div>
        <h3>No content available yet</h3>
        <p>Check back soon for exciting new music lessons!</p>
      </div>
    `;
    return;
  }

  const contentHTML = content.map(item => `
    <div class="content-card" data-content-id="${item.id}">
      <div class="content-card-header">
        <div class="content-icon">${getContentIcon(item.type)}</div>
        <h3 class="content-title">${item.title || 'Untitled'}</h3>
      </div>
      <div class="content-card-body">
        <p class="content-description">${item.description || 'No description available'}</p>
        ${item.difficulty ? `<div class="content-difficulty">Level: ${item.difficulty}</div>` : ''}
        ${item.duration ? `<div class="content-duration">⏱️ ${item.duration}</div>` : ''}
      </div>
      <div class="content-card-footer">
        <button class="btn btn-primary btn-small" onclick="openContent('${item.id}')">
          Start Learning
        </button>
      </div>
    </div>
  `).join('');

  container.innerHTML = contentHTML;
}

/**
 * Display loading state while fetching content
 * @param {string} containerId - ID of the DOM element to show loading state
 */
export function showContentLoading(containerId = 'content-container') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="loading-container">
      <div class="loading-spinner">🎵</div>
      <p>Loading amazing content...</p>
    </div>
  `;
}

/**
 * Display error state when content fetching fails
 * @param {string} errorMessage - Error message to display
 * @param {string} containerId - ID of the DOM element to show error state
 */
export function showContentError(errorMessage, containerId = 'content-container') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="error-container">
      <div class="error-icon">😕</div>
      <h3>Oops! Something went wrong</h3>
      <p>${errorMessage}</p>
      <button class="btn btn-primary" onclick="location.reload()">
        Try Again
      </button>
    </div>
  `;
}

/**
 * Get appropriate icon for content type
 * @param {string} type - Content type
 * @returns {string} Emoji icon
 */
function getContentIcon(type) {
  const icons = {
    'lesson': '📚',
    'exercise': '🎯',
    'game': '🎮',
    'song': '🎵',
    'theory': '🎼',
    'practice': '🎹',
    'default': '🎵'
  };
  return icons[type] || icons.default;
}

/**
 * Open content item (placeholder for future implementation)
 * @param {string} contentId - ID of the content to open
 */
window.openContent = function(contentId) {
  console.log('Opening content:', contentId);
  // TODO: Implement content opening logic
  // This could navigate to a content detail page or open a modal
  alert(`Opening content ${contentId} - Implementation coming soon!`);
};

/**
 * Initialize content display on page load
 * @param {string} containerId - ID of the DOM element to populate
 */
export async function initializeContent(containerId = 'content-container') {
  showContentLoading(containerId);
  
  const result = await fetchAllContent();
  
  if (result.error) {
    showContentError(result.error, containerId);
  } else {
    displayContent(result, containerId);
  }
} 
import { checkAuthStatus, logoutUser } from './auth.js';

document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle")
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", () => {
      document.body.classList.toggle("menu-open")
    })
  }

  // Pricing toggle
  const billingToggle = document.getElementById("billing-toggle")
  if (billingToggle) {
    billingToggle.addEventListener("change", function () {
      document.body.classList.toggle("annual", this.checked)
    })
  }

  // Testimonial slider (simple version)
  const testimonialSlider = document.querySelector(".testimonial-slider")
  if (testimonialSlider) {
    let isDown = false
    let startX
    let scrollLeft

    testimonialSlider.addEventListener("mousedown", (e) => {
      isDown = true
      testimonialSlider.classList.add("active")
      startX = e.pageX - testimonialSlider.offsetLeft
      scrollLeft = testimonialSlider.scrollLeft
    })

    testimonialSlider.addEventListener("mouseleave", () => {
      isDown = false
      testimonialSlider.classList.remove("active")
    })

    testimonialSlider.addEventListener("mouseup", () => {
      isDown = false
      testimonialSlider.classList.remove("active")
    })

    testimonialSlider.addEventListener("mousemove", (e) => {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageX - testimonialSlider.offsetLeft
      const walk = (x - startX) * 2
      testimonialSlider.scrollLeft = scrollLeft - walk
    })
  }

  // Only check authentication status on pages that need it
  // Public pages like home, plans, etc. don't need auth checks
  const currentPath = window.location.pathname;
  const publicPages = ['/', '/plans', '/login', '/signup', '/forgot-password'];
  
  if (!publicPages.includes(currentPath)) {
    // Only check auth on protected pages
    handleAuthStatus();
  }
})

/**
 * Checks authentication status and updates the UI accordingly.
 * Manages visibility of auth-related nav links and sets up logout handler.
 */
async function handleAuthStatus() {
  const authStatus = await checkAuthStatus();
  
  // Assume specific classes for nav items to show/hide
  const loggedInItems = document.querySelectorAll('.nav-logged-in');
  const loggedOutItems = document.querySelectorAll('.nav-logged-out');
  const logoutButton = document.getElementById('logout-button');
  const userProfileLink = document.getElementById('user-profile-link');
  const userDisplayName = document.getElementById('user-display-name');

  if (authStatus.isAuthenticated) {
    // User is logged in
    loggedOutItems.forEach(item => item.style.display = 'none');
    loggedInItems.forEach(item => item.style.display = 'block');
    
    // Update user-specific elements
    if (userProfileLink) {
      // Assuming a profile page exists at /profile
      userProfileLink.href = '/profile'; 
    }
    if (userDisplayName && authStatus.user) {
      userDisplayName.textContent = authStatus.user.displayName;
    }

  } else {
    // User is not logged in
    loggedInItems.forEach(item => item.style.display = 'none');
    loggedOutItems.forEach(item => item.style.display = 'block');
  }

  // Add logout functionality
  if (logoutButton) {
    logoutButton.addEventListener('click', async (e) => {
      e.preventDefault();
      console.log('Logout button clicked');
      const result = await logoutUser();
      if (!result.error) {
        // Redirect to home page on successful logout
        window.location.href = '/';
      } else {
        // Optionally, show an error message
        console.error('Logout failed:', result.message);
        alert('Logout failed. Please try again.');
      }
    });
  }
}

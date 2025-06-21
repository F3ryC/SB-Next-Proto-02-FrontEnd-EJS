const express = require('express');
const router = express.Router();

// App root now redirects to the login page.
router.get('/', (req, res) => {
  res.redirect('/login');
});

router.get("/login", (req, res) => {
  res.render("login", {
    title: "Sproutbeat - Sign In",
    active: "login"
  });
});

router.get("/signup", (req, res) => {
  res.render("signup", {
    title: "Sproutbeat - Create Account",
    active: "signup"
  });
  console.log("FC says SignUp page rendered");
});

router.get("/forgot-password", (req, res) => {
  res.render("forgot-password", {
    title: "Sproutbeat - Reset Password",
    active: "forgot-password"
  });
});

// Email verification page
router.get("/email-verified", (req, res) => {
  res.render("email-verified", {
    title: "Sproutbeat - Email Verified",
    active: "email-verified"
  });
});

// Reset password page (for email links)
router.get("/reset-password", (req, res) => {
  res.render("reset-password", {
    title: "Sproutbeat - Reset Password",
    active: "reset-password"
  });
});

// Protected route - client-side JS handles authentication checks
router.get("/dashboard", (req, res) => {
  res.render("dashboard", {
    title: "Sproutbeat - Dashboard",
    active: "dashboard"
  });
});

router.get("/user-landing", (req, res) => {
  res.render("user-landing", {
    title: "Sproutbeat - Welcome",
    active: "user-landing"
  });
});

module.exports = router; 
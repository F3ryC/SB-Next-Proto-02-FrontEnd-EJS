const express = require('express');
const router = express.Router();

const getFirebaseClientConfig = () => {
  return {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID_CLIENT, // Ensure this matches your .env key for client
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET_CLIENT, // Ensure this matches your .env key for client
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  };
};

// Web Routes (EJS Views)
router.get("/", (req, res) => {
  res.render("home", {
    title: "Sproutbeat Proto 02 UI FRONTEND - Music Education Platform",
    active: "home",
    firebaseConfig: JSON.stringify(getFirebaseClientConfig()) // Pass to home if needed
  });
  console.log("FC says Home page rendered");
});

router.get("/plans", (req, res) => {
  res.render("plans", {
    title: "Sproutbeat - Plans & Pricing",
    active: "plans",
  });
  console.log("FC says Plans page rendered");
});

router.get("/login", (req, res) => {
  res.render("login", {
    title: "Sproutbeat - Sign In",
    active: "login",
    firebaseConfig: JSON.stringify(getFirebaseClientConfig())
  });
});

router.get("/signup", (req, res) => {
  res.render("signup", {
    title: "Sproutbeat - Create Account",
    active: "signup",
    firebaseConfig: JSON.stringify(getFirebaseClientConfig())
  });
  console.log("FC says SignUp page rendered");
});

router.get("/forgot-password", (req, res) => {
  res.render("forgot-password", {
    title: "Sproutbeat - Reset Password",
    active: "forgot-password",
    firebaseConfig: JSON.stringify(getFirebaseClientConfig())
  });
});

// Example of a protected route that requires Firebase auth on the client-side
// We'll assume client-side JS handles checking if user is logged in via Firebase
router.get("/dashboard", (req, res) => {
  // This page should only be accessible if the user is logged in via Firebase on the client.
  // Server-side, we're just rendering the page.
  // Client-side JS on this page would verify Firebase auth state.
  res.render("dashboard", { // Assuming you have a dashboard.ejs from SbProto01
    title: "Sproutbeat - Dashboard",
    active: "dashboard",
    firebaseConfig: JSON.stringify(getFirebaseClientConfig()) // For client-side auth checks
  });
});

router.get("/user-landing", (req, res) => {
  res.render("user-landing", {
    title: "Sproutbeat - Welcome",
    active: "user-landing" 
  });
});

module.exports = router; 
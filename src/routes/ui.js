const express = require('express');
const router = express.Router();

// Web Routes (EJS Views) - Pure view rendering, no business logic
// All data fetching is handled by client-side JavaScript calling the backend API

router.get("/", (req, res) => {
  res.render("home", {
    title: "Sproutbeat Proto 02 UI FRONTEND - Music Education Platform",
    active: "home"
  });
  console.log("FC says Home page rendered");
});

router.get("/plans", (req, res) => {
  res.render("plans", {
    title: "Sproutbeat - Plans & Pricing",
    active: "plans"
  });
  console.log("FC says Plans page rendered");
});

module.exports = router; 
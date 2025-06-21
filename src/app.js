const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

// Import routes
const uiRoutes = require('./routes/ui');
const appRoutes = require('./routes/app');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// View engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set("layout", "layout");
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// --- Custom Subdomain Routing Middleware ---
app.use((req, res, next) => {
  // The 'hostname' property contains the hostname from the "Host" header.
  if (req.hostname === 'app.localhost') {
    // If the hostname matches, use the app router.
    appRoutes(req, res, next);
  } else {
    // Otherwise, use the main UI router for the marketing site.
    uiRoutes(req, res, next);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app; 
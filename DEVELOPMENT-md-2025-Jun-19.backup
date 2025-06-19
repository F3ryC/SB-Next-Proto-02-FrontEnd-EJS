# Netflix-Style CMS Development Notes (Music Education Focus with EJS Frontend)

## Project Overview
Building a Content Management System (CMS) for music education content. The system consists of a backend API built with Node.js and Express, and a server-rendered frontend using EJS, integrated from a previous prototype (`SbProto01`).

## Current Status

### Firebase Integration Status
- ✅ Firebase Authentication fully integrated for backend and client-side (EJS views).
- ✅ Service Usage Consumer and Firebase Admin IAM roles updated.
- ⚠️ Firebase Storage configuration and usage for content assets (e.g., thumbnails, content files) needs full verification and testing, though basic setup might be in place.

### Content System Status
- ✅ Content model adapted for music education.
- ✅ CRUD operations for content functional.
- ✅ Content seeding script (`seed-content.js`) successfully run.
- ✅ Sample assets downloaded by `setup-content.sh`.
- ⚠️ Asset management within content (linking to Storage) needs thorough testing.

### UI Integration (EJS)
- ✅ EJS views from `SbProto01` (home, login, signup, plans, dashboard, etc.) merged into `SbProto02`.
- ✅ Static assets (CSS, JS, images from `SbProto01/public`) integrated.
- ✅ Client-side Firebase SDK configured and passed to EJS views for authentication.

### Mailchimp Integration
- ✅ Mailchimp API integration for newsletter subscriptions.
- ✅ `/api/mailchimp/subscribe` endpoint functional.
- ✅ `/api/mailchimp/lists` endpoint for admin/testing.
- ✅ Mailchimp credentials configured via `.env`.
- ✅ Mailchimp connection test on server startup.

## Current Progress

### Backend
- **Authentication System**
  - ✅ Firebase Authentication integration (Admin SDK).
  - ✅ User registration (via client-side Firebase) and profile creation in local DB.
  - ✅ Token-based authentication (`authenticateUser` middleware using Firebase ID tokens).
  - ✅ Role-based access control (user, admin, content_creator) - foundational, needs further testing with UI.
- **User Management**
  - ✅ SQLite database for storing user profiles linked to Firebase UIDs.
  - ✅ API endpoints for user profile (`/api/auth/profile`).
  - ✅ (Admin user management endpoints from `SbProto01` like `/api/users` might need review/reintegration if still required beyond Firebase direct management).
- **Content Management**
  - ✅ Content model with fields: title, description, URLs, category, type, tags, etc.
  - ✅ CRUD operations for content (`/api/content`).
  - ✅ Protected content routes (POST, PUT, DELETE).
- **Email & Marketing**
  - ✅ Mailchimp SDK integration.
  - ✅ Service and Controller for Mailchimp operations.
  - ✅ API routes for subscription and listing audiences.

### Frontend (EJS - Server-Rendered)
- ✅ Express view engine configured for EJS with `express-ejs-layouts`.
- ✅ UI routes (`backend/src/routes/ui.js`) serving EJS pages.
- ✅ Static file serving from `backend/public`.
- ✅ Firebase client-side SDK configuration passed to EJS views (`firebaseConfig`).
- ✅ Basic UI structure for home, login, signup, plans, dashboard, forgot-password.

### Testing Infrastructure
- ✅ Automated test scripts using Node.js and Axios:
  - `test-auth.js` (Firebase Admin SDK test user & token generation)
  - `test-endpoints.js` (Protected API endpoints for content & auth profile)
  - `test-content-management.js` (Content CRUD operations)
  - `test-mailchimp.js` (Mailchimp subscription and list fetching)
- ✅ Comprehensive testing documentation (`TEST.md`) including UI and API manual testing steps.
- ✅ Database sync options (regular/force) via `FORCE_SYNC` env var.

## Technical Stack

### Backend & Templating
- Node.js with Express.js
- EJS (Embedded JavaScript templates) for server-side rendering
- Firebase Authentication (Admin SDK)
- SQLite with Sequelize ORM
- Mailchimp Marketing SDK (`@mailchimp/mailchimp_marketing`)

### Frontend (Client-Side in EJS views)
- HTML, CSS, JavaScript (from `SbProto01` public assets)
- Firebase Authentication (Client SDK)

### Development Tools
- `dotenv` for environment variable management
- `axios` for HTTP client in tests

## Next Steps (Refined)

1.  **Thorough UI Testing & Refinement (EJS Frontend)**
    - [ ] Test all user flows: signup, login (with Firebase client SDK), logout (if UI element exists), password reset.
    - [ ] Verify newsletter subscription form functionality from the UI to Mailchimp.
    - [ ] Ensure all EJS pages render correctly with proper data and styling.
    - [ ] Test dashboard access and protected client-side routes/views.
    - [ ] Debug any broken links or functionality from `SbProto01` merge.
2.  **Firebase Storage Deep Dive & Integration for Content**
    - [ ] Confirm IAM permissions for Firebase Storage are correctly set up for the service account.
    - [ ] Test uploading assets (thumbnails, content files) related to content items.
    - [ ] Ensure `thumbnailUrl` and `contentUrl` in the `Content` model correctly point to and serve from Firebase Storage.
    - [ ] Update content creation/update forms in EJS views (if any are to be built) or admin interface to handle file uploads to Storage.
3.  **Backend Enhancements (Consider after UI stabilization)**
    - [ ] Review and refine role-based access control, especially for admin functionalities.
    - [ ] Implement search/filtering for `/api/content` if not already robust.
4.  **Documentation Review**
    - [ ] Ensure `README.md` is up-to-date with setup and running instructions.
    - [ ] Keep `TEST.md` and `DEVELOPMENT.md` current.

## Original Project Steps (Re-evaluated)

1.  Backend Development - ✅ Largely complete for core features, Mailchimp added.
2.  Frontend Development - ✅ Initial phase complete with EJS UI integration. (Future: Could still be React.js or another modern framework if EJS limitations are hit).
3.  Content Features (Future Phase) - As originally planned.
4.  Advanced Features (Future Phase) - As originally planned.

## API Documentation (Key Endpoints)

### Authentication & User Profile
- GET `/api/auth/profile` - Get current user's profile (requires Firebase ID token)
  *(User registration/login is handled client-side via Firebase SDK, then token is used)*

### Content Management
- GET `/api/content` - Get all content
- GET `/api/content/:id` - Get content by ID
- POST `/api/content` - Create content (requires Firebase ID token)
- PUT `/api/content/:id` - Update content (requires Firebase ID token)
- DELETE `/api/content/:id` - Delete content (requires Firebase ID token)

### Mailchimp
- POST `/api/mailchimp/subscribe` - Subscribe email to list
- GET `/api/mailchimp/lists` - Get all Mailchimp lists (admin/info)

## Development Tips

1.  **Database Management**
    - Regular development: `npm start` (in `backend`)
    - Reset database: `FORCE_SYNC=true npm start` (in `backend`)
2.  **Testing**
    - Run individual test scripts: `node <script_name>.js` (e.g., `node test-mailchimp.js`)
    - Refer to `TEST.md` for comprehensive instructions.
3.  **Environment Setup (`backend/.env`)**
    - Ensure all Firebase and Mailchimp keys/IDs are correctly set.

## Immediate Focus

1.  **UI Testing**: Thoroughly test all EJS pages and user flows (signup, login, Mailchimp subscription).
2.  **Firebase Storage**: Verify and test integration for content assets if not already fully confirmed.

## Notes and Reminders

1.  Client-side Firebase authentication is key for the EJS views. Ensure `firebaseConfig` is correctly passed and used.
2.  Test Mailchimp form submissions from the actual UI, not just API.
3.  Keep all three major documents (`README.md`, `TEST.MD`, `DEVELOPMENT.MD`) in sync with progress. 
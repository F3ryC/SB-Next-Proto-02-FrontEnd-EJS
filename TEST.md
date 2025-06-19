# Netflix-Clone CMS API & UI (SbProto02) Testing Guide

This document provides instructions for testing the backend API, frontend UI rendering, and Mailchimp integration of the SbProto02 application.

## 1. Prerequisites

### 1.1. Environment Variables (`backend/.env`)

Ensure your `backend/.env` file is correctly configured. Key variables include:

```env
# Server & Database
PORT=3000
NODE_ENV=development # or 'production', 'test'
DATABASE_URL=sqlite:./dev.sqlite # Or your actual DB connection string
FORCE_SYNC=false # Set to true to force DB sync on start

# Firebase Admin SDK (for backend authentication)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"

# Firebase Client SDK (for EJS views)
FIREBASE_API_KEY=your-firebase-web-api-key
FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
FIREBASE_PROJECT_ID_CLIENT=your-firebase-project-id
FIREBASE_STORAGE_BUCKET_CLIENT=your-project-id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-web-app-id
FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX # Optional

# Mailchimp
MAILCHIMP_API_KEY=your_mailchimp_api_key-usXX
MAILCHIMP_SERVER_PREFIX=usXX # e.g., us19
MAILCHIMP_LIST_ID=your_mailchimp_audience_id

# JWT Secret (Not directly used if relying solely on Firebase ID tokens for session)
# JWT_SECRET=a_very_secure_secret_key_for_jwt # Keep if you have custom JWT logic
```

**Important:**
*   The `FIREBASE_PRIVATE_KEY` must be enclosed in double quotes with newlines as `\n`.
*   Mailchimp variables are essential for newsletter functionality and tests.

### 1.2. Install Dependencies
Navigate to the `backend` directory:
```bash
cd backend
npm install
```

### 1.3. Start the Server
From the `backend` directory:
```bash
npm start
# Or for development with Nodemon (if configured):
# npm run dev
```
The server should run on `http://localhost:3000` (or your configured `PORT`).

## 2. Database Sync Options

The application supports two modes of database synchronization, controlled by the `FORCE_SYNC` environment variable (or `NODE_ENV=test`):

1.  **Regular Mode (Default: `FORCE_SYNC=false`)**
    *   Preserves existing database data.
    *   Only updates schema if there are new changes.
    *   Recommended for most development and testing.

2.  **Force Sync Mode (`FORCE_SYNC=true` or `NODE_ENV=test`)**
    ```bash
    FORCE_SYNC=true npm start
    ```
    *   Drops and recreates all tables, clearing all existing data.
    *   Use when you need a clean database state or have made model changes.

## 3. Automated Test Scripts

These Node.js scripts are in the `backend/` directory. Run them from `backend/`.

### 3.1. Firebase Authentication Setup (`test-auth.js`)
Tests creation/retrieval of a test user via Firebase Admin SDK and generates an ID token.
```bash
node test-auth.js
```
**Note:** The output token is needed for other test scripts.

### 3.2. Protected API Endpoints (`test-endpoints.js`)
Tests protected API endpoints. **Update the `TOKEN` variable in `test-endpoints.js` with a valid Firebase ID token from `test-auth.js` or client-side login.**
```bash
node test-endpoints.js
```

### 3.3. Content Management API (`test-content-management.js`)
Tests CRUD operations for content. **Update the `TOKEN` variable in `test-content-management.js` with a valid Firebase ID token.**
```bash
node test-content-management.js
```

### 3.4. Mailchimp Integration (`test-mailchimp.js`)
Tests Mailchimp subscription and list retrieval. Requires Mailchimp env vars.
```bash
node test-mailchimp.js
```

## 4. Manual UI and API Testing

### 4.1. Manual UI Testing (Web Browser)

#### 4.1.1. Page Rendering
Open these URLs in your web browser:
*   **Home Page**: `http://localhost:3000/`
*   **Login Page**: `http://localhost:3000/login`
*   **Signup Page**: `http://localhost:3000/signup`
*   **Plans Page**: `http://localhost:3000/plans`
*   **Forgot Password Page**: `http://localhost:3000/forgot-password`
*   **Dashboard**: `http://localhost:3000/dashboard` (should require login)

Verify:
*   Pages render correctly without console errors.
*   Layout and static assets (CSS, JS, images) load as expected.

#### 4.1.2. Firebase Client-Side Integration
*   On pages like `/login`, `/signup`, check for `firebaseConfig` object in page source or browser console.
*   **Test Authentication Flows**:
    *   **Sign Up**: Use the `/signup` page to create a new Firebase user.
    *   **Login**: Use the `/login` page to sign in with an existing Firebase user.
    *   **Logout**: If a logout button exists, test it.
    *   **Forgot Password**: Test the `/forgot-password` flow.
    *   **Dashboard Access**: Verify `/dashboard` is accessible after login and protected otherwise.
*   Check browser developer console for any Firebase-related errors.

#### 4.1.3. Mailchimp Signup Form (UI)
*   Locate any newsletter signup forms in the UI.
*   Attempt to subscribe with a valid email. Verify UI feedback and check Mailchimp audience.
*   Attempt to subscribe with an invalid email. Verify UI error messages.
*   Attempt to subscribe with an already subscribed email. Verify UI feedback.
*   Check browser's Network tab in developer tools for `POST` request to `/api/mailchimp/subscribe`.

### 4.2. Manual API Testing with `curl`

Replace `YOUR_FIREBASE_ID_TOKEN` with a valid token obtained from client-side Firebase login (e.g., from browser's developer tools after logging in through the UI, or from `test-auth.js`).

#### 4.2.1. Authentication Endpoints
*   **Get User Profile (GET `/api/auth/profile`)**
    ```bash
    curl -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" http://localhost:3000/api/auth/profile | json_pp
    ```

#### 4.2.2. User Management Endpoints (Example)
*Note: User creation/management is primarily via Firebase SDK on client. Backend `/api/users` might be for admin purposes.*
*   **Get All Users - Example Admin-Only (GET `/api/users`)**
    *(This endpoint's existence and protection depend on your `userRoutes.js`)*
    ```bash
    curl -H "Authorization: Bearer YOUR_ADMIN_FIREBASE_ID_TOKEN" http://localhost:3000/api/users | json_pp
    ```
*   **Get User by ID (GET `/api/users/:id`)**
    *(Assuming ID here is Firebase UID or your internal User model ID)*
    ```bash
    curl -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" http://localhost:3000/api/users/USER_ID_OR_UID | json_pp
    ```

#### 4.2.3. Content Management Endpoints
*   **Get All Content (GET `/api/content`)**
    *(If public, no token needed. If protected as in current setup for POST/PUT/DELETE, token needed for those.)*
    ```bash
    curl http://localhost:3000/api/content | json_pp
    ```
*   **Get Content by ID (GET `/api/content/:id`)**
    ```bash
    curl http://localhost:3000/api/content/YOUR_CONTENT_ID | json_pp
    ```
*   **Create Content (POST `/api/content`)** (Requires Auth)
    ```bash
    curl -X POST http://localhost:3000/api/content \
      -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "title": "New EJS Test Movie",
        "description": "A great movie added via curl for EJS UI.",
        "category": "movie",
        "contentType": "video",
        "tags": ["curl", "test"],
        "thumbnailUrl": "http://example.com/thumb.jpg",
        "contentUrl": "http://example.com/movie.mp4"
      }' | json_pp
    ```
*   **Update Content (PUT `/api/content/:id`)** (Requires Auth)
    ```bash
    curl -X PUT http://localhost:3000/api/content/YOUR_CONTENT_ID \
      -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "title": "Updated Movie Title via Curl"
      }' | json_pp
    ```
*   **Delete Content (DELETE `/api/content/:id`)** (Requires Auth)
    ```bash
    curl -X DELETE http://localhost:3000/api/content/YOUR_CONTENT_ID \
      -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN"
    ```

#### 4.2.4. Mailchimp API
*   **Subscribe to Newsletter (POST `/api/mailchimp/subscribe`)**
    ```bash
    curl -X POST http://localhost:3000/api/mailchimp/subscribe \
      -H "Content-Type: application/json" \
      -d '{
        "email": "curl_test@example.com",
        "firstName": "Curl",
        "lastName": "Test"
      }' | json_pp
    ```
*   **Get Mailchimp Lists (GET `/api/mailchimp/lists`)** (For admin/info)
    ```bash
    curl http://localhost:3000/api/mailchimp/lists | json_pp
    ```

## 5. Response Formats

### Success Responses
- `200 OK`: Successful GET/PUT requests.
- `201 Created`: Successful POST requests.
- `204 No Content`: Successful DELETE requests (though API might return 200 with a message).

### Error Responses
- `400 Bad Request`: Invalid input (e.g., missing fields, validation errors).
- `401 Unauthorized`: Missing, invalid, or expired Firebase ID token.
- `403 Forbidden`: Authenticated user lacks permission for the action.
- `404 Not Found`: Resource not found.
- `409 Conflict`: Resource already exists (e.g., email already subscribed).
- `500 Internal Server Error`: Unexpected server-side error.

## 6. Testing Tips

1.  **Authentication First**: For protected API endpoints, always ensure you have a valid Firebase ID token.
2.  **Permissions**: If using role-based access, test with tokens from users with different roles.
3.  **Track IDs**: Keep track of created resource IDs for update/delete operations.
4.  **Invalid Data**: Test API endpoints with invalid data, missing fields, and incorrect formats to check error handling.
5.  **Console Logs**: Monitor server console and browser developer console for errors or important logs.
6.  **Database State**: Use a DB browser to inspect SQLite database (`dev.sqlite` or similar) to verify data changes.
7.  **Mailchimp Audience**: Directly check your Mailchimp audience to confirm subscriptions.
8.  **`json_pp`**: If you have `json_pp` (often part of a JSON Perl package) or a similar command-line JSON pretty-printer, pipe `curl` output to it for readability: `| json_pp`. 
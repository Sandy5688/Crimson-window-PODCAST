# Podcast Feeds Deployment & Health Checker

## Overview

This repository manages podcast feeds across multiple platforms, providing tools to verify feed accessibility, display enriched metadata, and deliver proof of operational status to clients. It includes a health checker script, structured channel data, secure credential management, and a React-based frontend with authentication, real-time updates, and protected routes.

The project fulfills the client’s requirements by:
- Adding a `/metadata/:id` route in the frontend to display enriched metadata for podcast feeds.
- Configuring API calls using `process.env.REACT_APP_API_URL` (set to `http://localhost:5000/api`).
- Ensuring metadata is rendered securely within the protected app flow (similar to Dashboard and AutoUpload).

## Contents

1. **Feed Data**
   - `feeds.json`: JSON list of podcast channels and their platforms (e.g., Amazon Music, Deezer, Podchaser).
   - `channels.xlsx`: Excel file summarizing channel details, including:
     - Channel name
     - Email
     - Platform
     - Brand name
     - RSS feed URL
     - Date created/submitted
     - Status (e.g., APPROVED, PENDING VERIFICATION)
     - Platform-specific links
   - `statuses.json`: Output from the health checker, containing feed status and timestamps.

2. **Health Checker**
   - `check_feeds.py`: Python script that:
     - Parses `feeds.json`.
     - Checks the live status of each RSS feed.
     - Generates `statuses.json` with HTTP status codes or error messages.
     - Compatible with Mac and Windows.
   - Dependencies: `requests`, `feedparser`, `python-dotenv`.

3. **Frontend**
   - **Routing & Core**:
     - `client/src/App.js`: Main routing file with protected routes for `/dashboard`, `/autoupload`, and `/metadata/:id`. Wrapped with `AuthProvider` and `SocketProvider`.
     - `client/src/utils/api.js`: Axios-based API client using `process.env.REACT_APP_API_URL` for backend communication.
     - `client/src/pages/EnrichedMetadata.js`: Displays enriched metadata for a podcast feed (by channel ID) in a table format.
     - `client/src/pages/NotFound.js`: Handles 404 errors for invalid routes.
   - **Authentication & Contexts**:
     - `client/src/contexts/AuthContext.js`: Manages global auth state (login/logout, token storage in `localStorage`).
     - `client/src/contexts/SocketContext.js`: Handles real-time Socket.io connections for feed updates.
     - `client/src/components/ProtectedRoute.js`: Ensures authenticated access to protected routes using `AuthContext`.
     - `client/src/pages/Login.js`: Login form integrating with backend `/api/login`.
   - **Pages & Forms**:
     - `client/src/pages/Dashboard.js`: Overview of podcast feeds with links to metadata; listens for Socket.io updates.
     - `client/src/pages/AutoUploadForm.js`: Form for uploading new RSS feeds to the backend `/api/upload`.
   - `client/.env`: Configures `REACT_APP_API_URL=http://localhost:5000/api` (not committed for security).

4. **Credentials**
   - Stored in a separate `.env` file (not committed) for platforms like Amazon Music, Deezer, iHeartRadio, TuneIn, and Podchaser.
   - Access credentials via a secure vault or encrypted ZIP shared privately.

5. **Proof of Verification**
   - Screenshots and XML feed views (in `docs/screenshots`) provide visual proof of feed accessibility.
   - Podchaser feeds are verified where applicable.

## Prerequisites

- **Backend**:
  - Node.js (v14 or higher)
  - Python 3 (for `check_feeds.py`)
  - Dependencies: `requests`, `feedparser`, `python-dotenv` (install via `pip install requests feedparser python-dotenv`)
  - Socket.io: For real-time updates (install via `npm install socket.io`)
- **Frontend**:
  - Node.js (v14 or higher)
  - Dependencies: `axios`, `react-router-dom`, `socket.io-client` (install via `npm install axios react-router-dom socket.io-client`)
- **Environment**:
  - Backend: `.env` file with platform credentials (e.g., `AMAZON_CH1_EMAIL`, `AMAZON_CH1_PASSWORD`)
  - Frontend: `client/.env` with `REACT_APP_API_URL=http://localhost:5000/api`

## Setup Instructions

### Backend
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```
2. Install Python dependencies:
   ```bash
   pip install requests feedparser python-dotenv
   ```
3. Set up backend `.env` file (in root directory) with platform credentials (example):
   ```plaintext
   AMAZON_CH1_EMAIL=member@rhythmaura.digital
   AMAZON_CH1_PASSWORD=Rhythmn2025@@
   DEEZER_CH1_EMAIL=member@rhythmaura.digital
   DEEZER_CH1_PASSWORD=Rhythmn2025@@
   # Add other credentials as needed
   ```
4. Implement required endpoints (example in `server.js`):
   - `/api/metadata/:id`: Returns enriched metadata.
   - `/api/login`: Authenticates user (returns JWT token).
   - `/api/feeds`: Returns list of feeds.
   - `/api/upload`: Handles RSS file uploads.
   - Socket.io: Emit events like `feedUpdated`.
   ```javascript
   const express = require("express");
   const fs = require("fs").promises;
   const http = require("http");
   const socketIo = require("socket.io");
   const app = express();
   const server = http.createServer(app);
   const io = socketIo(server);

   app.use(express.json());

   // Example /api/metadata/:id (from previous)
   // ...

   io.on('connection', (socket) => {
     socket.on('feedUpdated', (data) => {
       io.emit('feedUpdated', data);
     });
   });

   server.listen(5000, () => console.log("Server running on port 5000"));
   ```
5. Start the backend:
   ```bash
   node server.js
   ```

### Frontend
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install axios react-router-dom socket.io-client
   ```
3. Create `client/.env`:
   ```plaintext
   REACT_APP_API_URL=http://localhost:5000/api
   ```
4. Start the React app:
   ```bash
   npm start
   ```

### Health Checker
1. Ensure `feeds.json` is in the root directory.
2. Run the health checker:
   ```bash
   python check_feeds.py
   ```
3. Verify `statuses.json` is generated with feed statuses and timestamps.

## Usage

### Health Checker
- Run `python check_feeds.py` to verify RSS feed accessibility.
- Output: `statuses.json` with status (e.g., "ok", "HTTP 404", "error: timeout") and `checked_at` timestamps.

### Frontend
- Access the app at `http://localhost:3000`.
- **Auth Flow**: Start at `/login` → Enter credentials → Redirect to `/dashboard`.
- **Routes**:
  - `/`: Redirects to `/dashboard`.
  - `/login`: Authentication form.
  - `/dashboard`: Protected overview of feeds with Socket.io updates and links to `/metadata/:id`.
  - `/autoupload`: Protected form for uploading new RSS feeds.
  - `/metadata/:id`: Displays enriched metadata for a channel (e.g., `/metadata/ONE`).
  - Any invalid route (e.g., `/random`): Shows 404 page.
- **Real-Time**: Socket.io updates the dashboard on feed changes (e.g., after upload).
- **Metadata Display**: The `/metadata/:id` route shows a table with:
  - Channel
  - Platform
  - RSS URL (clickable)
  - Status
  - Checked At
  - Email
  - Brand Name
  - Date Created
  - Date Submitted
  - Link (clickable)

### Backend
- The `/api/metadata/:id` endpoint returns combined data from `feeds.json`, `statuses.json`, and `channels.xlsx`.
- Example response for `/api/metadata/ONE`:
  ```json
  {
    "channel": "ONE",
    "platform": "Amazon Music",
    "url": "https://feed.podbean.com/emmanuelatere2000/feed.xml",
    "status": "ok",
    "checked_at": "2025-10-02T05:00:00Z",
    "email": "member@rhythmaura.digital",
    "brandName": "The Emmanuelatere2000's Podcast",
    "dateCreated": "24-09-2025",
    "dateSubmitted": "24-09-2025",
    "link": "https://music.amazon.co.uk/podcasts/c40177c1-4854-4ef6-bff0-9742e23db7fe/the-emmanuelatere2000s-podcast"
  }
  ```

## Testing

1. **Health Checker**:
   - Run `python check_feeds.py`.
   - Verify `statuses.json` contains correct statuses for all feeds in `feeds.json`.
2. **Backend**:
   - Start the server: `node server.js`.
   - Test with Postman:
     - `POST http://localhost:5000/api/login` (body: `{ "email": "test@example.com", "password": "test" }`): Expect 200 with token.
     - `GET http://localhost:5000/api/metadata/ONE`: Expect 200 with metadata.
     - `GET http://localhost:5000/api/feeds`: Expect list of feeds.
     - `POST http://localhost:5000/api/upload`: Multipart form with RSS file.
     - `GET http://localhost:5000/api/metadata/INVALID`: Expect 404.
3. **Frontend**:
   - Start the React app: `cd client && npm start`.
   - Test auth: `/login` → Login → Verify redirect to `/dashboard`.
   - Test dashboard: See feeds table; click "View Metadata" for `/metadata/ONE`.
   - Test upload: `/autoupload` → Upload sample RSS → Check Socket.io update on dashboard.
   - Test invalid: `/metadata/INVALID` → "No metadata found"; `/random` → 404.
4. **Integration**:
   - Run `check_feeds.py`, then reload `/metadata/ONE` to confirm updated `status` and `checked_at`.
   - Verify table fields match `feeds.json`, `statuses.json`, and `channels.xlsx`.

## Security Notes
- **Credentials**: Never commit `.env` files to the repository. Use a secure vault or encrypted ZIP to share credentials.
- **Authentication**: Uses JWT tokens stored in `localStorage`; adjust for your production auth system.
- **Screenshots**: Store verification screenshots in `docs/screenshots` for client review.

## Troubleshooting
- **Backend Errors**: Ensure `feeds.json` and `statuses.json` exist. Check server logs for errors.
- **Frontend Errors**: Verify `axios`, `react-router-dom`, and `socket.io-client` are installed. Check console for API/Socket errors.
- **Auth Issues**: Confirm `AuthContext` and `ProtectedRoute` match your backend `/api/login`.
- **Socket Issues**: Ensure backend Socket.io is running on port 5000.
- **Field Mismatches**: If table fields are undefined, ensure backend `/metadata/:id` returns expected fields (e.g., `brandName` vs `brand_name`).

## Future Improvements
- Add CSS file for `EnrichedMetadata.js` and forms to replace inline styles.
- Implement backend database (e.g., MongoDB) instead of mock `channels.xlsx` data.
- Add refresh button in `EnrichedMetadata.js` to re-fetch metadata.
- Support pagination or filtering for large numbers of channels.

## License
Proprietary – For internal use only. Do not distribute without permission.

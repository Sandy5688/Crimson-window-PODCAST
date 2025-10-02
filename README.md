# Podcast Feeds Deployment & Health Checker

## Overview

This repository manages podcast feeds across multiple platforms, providing tools to verify feed accessibility, display enriched metadata, and deliver proof of operational status to clients. It includes a health checker script, structured channel data, secure credential management, and a React-based frontend for viewing metadata within a protected app flow.

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
   - `client/src/App.js`: Main routing file with protected routes for `/dashboard`, `/autoupload`, and `/metadata/:id`.
   - `client/src/utils/api.js`: Axios-based API client using `process.env.REACT_APP_API_URL` for backend communication.
   - `client/src/pages/EnrichedMetadata.js`: Displays enriched metadata for a podcast feed (by channel ID) in a table format.
   - `client/src/pages/NotFound.js`: Handles 404 errors for invalid routes.
   - `client/src/components/ProtectedRoute.js`: Ensures authenticated access to protected routes.
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
- **Frontend**:
  - Node.js (v14 or higher)
  - Dependencies: `axios`, `react-router-dom` (install via `npm install axios react-router-dom`)
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
   AMAZON_CH1_PASSWORD=******
   DEEZER_CH1_EMAIL=member@rhythmaura.digital
   DEEZER_CH1_PASSWORD=******
   # Add other credentials as needed
   ```
4. Implement the `/api/metadata/:id` endpoint (example in `server.js`):
   ```javascript
   const express = require("express");
   const fs = require("fs").promises;
   const app = express();

   app.use(express.json());

   app.get("/api/metadata/:id", async (req, res) => {
     try {
       const feeds = JSON.parse(await fs.readFile("feeds.json"));
       const statuses = JSON.parse(await fs.readFile("statuses.json"));
       const id = req.params.id;
       const feed = feeds.find((f) => f.channel === id);
       const status = statuses.find((s) => s.channel === id);
       if (!feed || !status) {
         return res.status(404).json({ message: "Metadata not found" });
       }
       // Mock channels.xlsx data (replace with actual data source)
       const channelData = {
         ONE: {
           email: "member@rhythmaura.digital",
           brandName: "The Emmanuelatere2000's Podcast",
           dateCreated: "24-09-2025",
           dateSubmitted: "24-09-2025",
           link: "https://music.amazon.co.uk/podcasts/c40177c1-4854-4ef6-bff0-9742e23db7fe/the-emmanuelatere2000s-podcast",
         },
         // Add other channels
       };
       res.json({ ...feed, ...status, ...channelData[id] });
     } catch (error) {
       res.status(500).json({ message: "Server error" });
     }
   });

   app.listen(5000, () => console.log("Server running on port 5000"));
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
   npm install axios react-router-dom
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
- Example:
  ```json
  [
    {
      "channel": "ONE",
      "platform": "Amazon Music",
      "url": "https://feed.podbean.com/emmanuelatere2000/feed.xml",
      "status": "ok",
      "checked_at": "2025-10-02T05:00:00Z"
    }
  ]
  ```

### Frontend
- Access the app at `http://localhost:3000`.
- **Routes**:
  - `/`: Redirects to `/dashboard`.
  - `/dashboard`: Protected dashboard (requires authentication).
  - `/autoupload`: Protected auto-upload page.
  - `/metadata/:id`: Displays enriched metadata for a channel (e.g., `/metadata/ONE`).
  - Any invalid route (e.g., `/random`): Shows 404 page.
- **Authentication**: Ensure a valid `authToken` is stored in `localStorage` (or adjust `ProtectedRoute.js` for your auth system).
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
     - `GET http://localhost:5000/api/metadata/ONE`: Expect 200 with metadata.
     - `GET http://localhost:5000/api/metadata/INVALID`: Expect 404 with `{ "message": "Metadata not found" }`.
3. **Frontend**:
   - Start the React app: `cd client && npm start`.
   - Set `localStorage.setItem("authToken", "your-token")` for authentication.
   - Test routes:
     - `http://localhost:3000/`: Redirects to `/dashboard`.
     - `http://localhost:3000/metadata/ONE`: Shows metadata table for channel “ONE”.
     - `http://localhost:3000/metadata/INVALID`: Shows “No metadata found for ID: INVALID”.
     - `http://localhost:3000/random`: Shows 404 page.
     - Clear `localStorage` and visit `/metadata/ONE`: Redirects to `/login`.
4. **Integration**:
   - Run `check_feeds.py`, then reload `/metadata/ONE` to confirm updated `status` and `checked_at`.
   - Verify table fields match `feeds.json`, `statuses.json`, and `channels.xlsx`.

## Security Notes
- **Credentials**: Never commit `.env` files to the repository. Use a secure vault or encrypted ZIP to share credentials.
- **Authentication**: Adjust `ProtectedRoute.js` to match your app’s authentication system (e.g., JWT, session).
- **Screenshots**: Store verification screenshots in `docs/screenshots` for client review.

## Troubleshooting
- **Backend Errors**: Ensure `feeds.json` and `statuses.json` exist. Check server logs for errors.
- **Frontend Errors**: Verify `axios` and `react-router-dom` are installed. Check console for API errors.
- **Auth Issues**: Confirm `ProtectedRoute.js` matches your auth logic.
- **Field Mismatches**: If table fields are undefined, ensure backend `/metadata/:id` returns expected fields (e.g., `brandName` vs `brand_name`).

## Future Improvements
- Add CSS file for `EnrichedMetadata.js` to replace inline styles.
- Implement backend database (e.g., MongoDB) instead of mock `channels.xlsx` data.
- Add refresh button in `EnrichedMetadata.js` to re-fetch metadata.
- Support pagination or filtering for large numbers of channels.

## License
Proprietary – For internal use only. Do not distribute without permission.

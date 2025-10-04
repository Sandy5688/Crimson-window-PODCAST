# Podcast Feeds Deployment & Health Checker 🚀

## Overview
Central hub for managing 10+ podcast channels across platforms (Amazon Music, Deezer, iHeartRadio, TuneIn, Podchaser). Includes health checks, enriched metadata viewer, auth-protected dashboard, and real-time Socket.io updates. Built for scale—feeds.json with multi-URLs, .env creds for 50 channels.

**GitHub Repo**: [https://github.com/yourusername/podcast-feeds [Replace with yours! Fork it, star it, break it responsibly.]](https://github.com/Sandy5688/Crimson-window-PODCAST/edit/main/README.md)

## Contents
- **Data**: feeds.json (multi-URL arrays), channels.xlsx (summaries), statuses.json (generated).
- **Backend**: server.js (Express + Socket.io + /api/metadata/:id), check_feeds.py (Python health checker).
- **Frontend** (client/): React app with auth, dashboard, upload placeholder, metadata table.
  - **src/components/**: ProtectedRoute.js (auth guard).
  - **src/contexts/**: AuthContext.js, SocketContext.js (state + real-time).
  - **src/pages/**: Dashboard.js (stats/chart), AutoUploadForm.js (coming soon), EnrichedMetadata.js (table viewer), Login.js, NotFound.js.
  - **src/utils/**: api.js (axios interceptor magic).

## Prerequisites
- Node.js 14+ (backend/frontend).
- Python 3+ (health checker).
- Frontend deps: `cd client && npm i react react-dom react-router-dom axios socket.io-client`.
- Backend deps: `npm i express cors socket.io`.

## Setup (A-Z Quickstart)
1. **Clone**: `git clone https://github.com/yourusername/podcast-feeds && cd podcast-feeds`.
2. **Backend Creds**: Edit `.env` (gitignore'd—add your keys from channels.env history).
3. **Health Check**: `python check_feeds.py` (generates statuses.json from feeds.json).
4. **Backend**: `node server.js` (port 5000; test /api/metadata/ONE).
5. **Frontend**: `cd client && npm start` (port 3000).
6. **Test Flow**: Login → Dashboard (stats + Socket updates) → /metadata/ONE (table with feeds/statuses).

## Usage
- **Health**: Run py script → statuses.json updates (integrates with dashboard).
- **Metadata**: /metadata/ONE pulls feeds + statuses + mock xlsx data (table with URLs, status, email, links).
- **Real-Time**: Socket emits 'feedUpdated' on connect—Dashboard listens.
- **Upload**: Placeholder in AutoUploadForm (Repo B ready? Unlock it).

## Testing
- Backend: Postman GET http://localhost:5000/api/metadata/ONE (full JSON).
- Frontend: /login (test creds) → /dashboard → /autoupload → /random (404).
- Socket: Console logs 'connected' + 'feedUpdated'.

## Security
- .env gitignored—share via encrypted ZIP/vault.
- Tokens in localStorage (JWT via /auth/login—expand for prod).

## Future Vibes
- Repo B upload integration.
- Database swap for xlsx mocks.
- More Socket events (e.g., 'activityUpdated').

Questions? Ping me—let's keep the feeds flowing! 🎙️

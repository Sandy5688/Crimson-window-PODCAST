Crimson Window Podcast Feeds – Deployment & Health Checker 

Welcome to Crimson Window Podcast, your all-in-one hub for managing, verifying, and deploying podcast feeds across major platforms (Amazon Music, Deezer, iHeartRadio, TuneIn, Podchaser). This monorepo combines a resilient Node.js backend, Python health checker, and React frontend for a seamless, scalable experience. Built for 50+ channels with real-time Socket.io updates, AWS Secrets Manager integration, and manual TuneIn overrides.Repo Stats: 10 active channels, multi-URL feeds, pending statuses for verification.

Quick StartClone: 

1. git clone https://github.com/Sandy5688/Crimson-window-PODCAST.git && cd Crimson-window-PODCAST.
2. Backend: npm i (root) → Copy .env.example to .env (fill from AWS Secrets Manager /prod/podcasts/creds) → npm start (port 5000). 
3. Health Check: python -m venv venv && source venv/bin/activate (Windows: venv\Scripts\activate) → pip install requests feedparser python-dotenv → python check_feeds.py (generates statuses.json).
4. Frontend: cd client && npm i → Copy client/.env.example to client/.env → npm start (port 3000).
5. Dev Mode: npm run dev (runs backend + frontend concurrently).

Test: /metadata/ONE → Table with feeds, status (pending if no check), AWS-loaded emails.

Folder Structure

* Root (Backend/Data):
  
  * server.js: Express server + Socket.io + endpoints (/api/metadata/:id, /api/dashboard/*, /api/health, /api/feeds/:channel/status).
  * check_feeds.py: Python RSS health checker.
  * feeds.json: Channel data (multi-URLs, tunein_status field).
  * channels.xlsx: Summaries (mocked in server.js).
  * .env.example: Cred template (fill from vault).

* client/ (React Frontend):
  
  * src/pages/: Views (Dashboard.js with stats/chart, EnrichedMetadata.js table, Login.js, NotFound.js, AutoUploadForm.js placeholder).
  * src/contexts/: State (AuthContext.js JWT, SocketContext.js real-time).
  * src/components/: Guards (ProtectedRoute.js).
  * src/utils/: Helpers (api.js with interceptors).
  * .env.example: Frontend vars (API/Socket URLs).
 
* Features

  * Health Checker: python check_feeds.py → statuses.json with HTTP status/checked_at. Background cron in server.js runs every 5 mins + emits 'feedUpdated' Socket event (Dashboard auto-refreshes).
  * Metadata: GET /api/metadata/:id → Merges feeds.json + statuses.json + channel mocks (emails from AWS creds, fallback pending if no statuses).
  * Dashboard: Mocks for /api/dashboard/stats (totals), /recent-activity (list), /metrics-history (chart data)—local testing without Repo A.
  * TuneIn Manual: "tunein_status": "pending" in feeds.json (manual verification). POST /api/feeds/:channel/status { "status": "approved" } → Updates file + emits Socket.
  * Real-Time: Socket.io 'feedUpdated' on connect/health run—use useSocket in Dashboard.
  * Health Monitor: GET /api/health → { ok: true, feeds: 50 }.
  * Security: AWS Secrets Manager (/prod/podcasts/creds) loads on start—no .env leaks (gitignore'd).
 
    TuneIn: Pending until support approves via override—integrates with frontend table.

* Run Instructions

  * Backend: npm i (root) → Copy .env.example to .env (fill from AWS) → npm start (port 5000).
  * Health Checker: python -m venv venv && source venv/bin/activate (Windows: venv\Scripts\activate) → pip install requests feedparser python-dotenv → python check_feeds.py.
  * Frontend: cd client && npm i → Copy client/.env.example to client/.env → npm start (port 3000).
  * Full Dev: npm run dev (concurrent backend/frontend).
  * Health + Socket: Run checker → Server emits 'feedUpdated' (every 5 mins via cron).

* Testing (Smoke Tests)
  
  1. python check_feeds.py: Creates statuses.json with status/checked_at.
  2. node server.js: Boots on 5000, no errors. GET /api/metadata/ONE → JSON with pending fallback.
  3. npm start in /client: UI opens, /metadata/ONE fetches JSON (table shows).
 
* Security & Deployment

  * Credentials: AWS Secrets Manager (/prod/podcasts/creds)—loaded on server start (fallback mocks local).
  * .gitignore: Blocks .env, statuses.json, node_modules.
  * Deploy: Vercel/Netlify for frontend, Heroku/EC2 for backend (IAM role for AWS secrets).
  * TuneIn: Manual override ensures "pending" until support verifies.

* Future
  
  * Repo B upload integration.
  * DB for channels (MongoDB swap mocks).
  * More Socket events (activityUpdated).



















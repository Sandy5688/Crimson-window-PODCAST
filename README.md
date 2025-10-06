[Podcast Feeds Deployment & Health Checker OverviewComplete monorepo for podcast feed management: Health checker, backend server with Socket.io real-time, React frontend with auth/dashboard/metadata viewer. Supports 50 channels across Amazon Music, Deezer, iHeartRadio, TuneIn, Podchaser. TuneIn manual verification via override endpoint.Repo URL: [Your GitHub Repo URL, e.g., [https://github.com/Sandy5688/Crimson-window-PODCAST] (fork/star/contribute!).Folder StructureRoot: Backend/data/scripts.server.js: Express + Socket.io + endpoints (/api/metadata/:id, /api/dashboard/*, /api/health, /api/feeds/:channel/status).
check_feeds.py: Python health checker.
feeds.json: Multi-URL channel data (with tunein_status field).
channels.xlsx: Channel summaries (mocked in server.js).
.env.example: Cred template (fill from AWS).

client/: React frontend.src/pages/: Views (Dashboard.js, EnrichedMetadata.js, Login.js, NotFound.js, AutoUploadForm.js).
src/contexts/: State (AuthContext.js, SocketContext.js).
src/components/: Guards (ProtectedRoute.js).
src/utils/: Helpers (api.js).
.env.example: Frontend vars (API/Socket URLs).

PrerequisitesNode.js v14+ (backend/frontend).
Python v3.8+ (health checker).
AWS Account (Secrets Manager for creds—free tier OK).

Setup InstructionsBackend (Root)npm i (installs express, cors, socket.io, node-cron, aws-sdk, dotenv).
Copy .env.example to .env → Fill placeholders from AWS Secrets Manager (/prod/podcasts/creds).
npm start (or node server.js) → Runs on port 5000.

Health Checker (Root)python3 -m venv venv && source venv/bin/activate (Windows: venv\Scripts\activate) → pip install -r requirements.txt (or list Python dependencies: requests, feedparser, python-dotenv) → run python check_feeds.py → Generates statuses.json.Frontend (client/)npm i (installs react, react-router-dom, axios, socket.io-client).
Copy client/.env.example to client/.env → Set REACT_APP_API_URL=http://localhost:5000/api and REACT_APP_SOCKET_URL=http://localhost:5000.
npm start → Runs on port 3000.

Full Dev ModeSteps: run python check_feeds.py → npm install in root and client → npm start both or npm run dev script (add to root package.json: "dev": "concurrently "node server.js" "cd client && npm start"").How to Run Health Checker & Server Emits EventsHealth Checker: python check_feeds.py → Updates statuses.json (multi-URL handled, resilient).
Server Emits: Background cron runs checker every 5 mins → Emits 'feedUpdated' to all clients (Dashboard refreshes). Manual: POST /api/feeds/:channel/status triggers emit. Listen in frontend with useSocket.

UsageHealth Check: Run script → statuses.json → Server emits 'feedUpdated'.
Metadata: GET /api/metadata/ONE → Merges feeds + statuses + channel mocks (emails from AWS creds).
Dashboard: GET /api/dashboard/stats (total channels), /recent-activity (list), /metrics-history (chart data)—mocks for local.
TuneIn Manual: POST /api/feeds/ONE/status { "status": "approved" } → Updates feeds.json.tunein_status + emits Socket.
Health Monitor: GET /api/health → { ok: true, feeds: 50 }.

TuneIn: Starts "pending" (manual verification)—override endpoint for support team approval.Testing (Smoke Tests)python check_feeds.py: Creates statuses.json with status/checked_at. 
node server.js: Boots on 5000, no errors. GET /api/metadata/ONE → Full JSON with pending if no statuses. 
npm start in /client: UI opens, /metadata/ONE fetches JSON (table shows). 

Security & DeploymentCredentials: AWS Secrets Manager (/prod/podcasts/creds)—loaded on server start (fallback mocks local).
.gitignore: Blocks .env, statuses.json, node_modules.
Deploy: Vercel/Netlify for frontend, Heroku/EC2 for backend (set AWS IAM role for secrets).
TuneIn: Manual override ensures "pending" until support verifies.

FutureRepo B upload integration.
DB for channels (MongoDB swap mocks).
More Socket events (activityUpdated).

](https://github.com/Sandy5688/Crimson-window-PODCAST)

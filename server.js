const express = require("express");
const cors = require("cors");  // npm i cors for cross-origin (frontend:3000)
const http = require("http");
const socketIo = require("socket.io");  // npm i socket.io
const fs = require("fs").promises;
const cron = require("node-cron");  // npm i node-cron for background job
const { exec } = require("child_process");  // For running Python

const app = express();
const server = http.createServer(app);  // http for Socket.io
const io = socketIo(server, { cors: { origin: "http://localhost:3000" } });  // CORS for frontend

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));  // Allow React dev server

// Metadata endpoint (your resilient version)
app.get("/api/metadata/:id", async (req, res) => {
  try {
    // Read feeds first (critical)
    let feeds;
    try {
      feeds = JSON.parse(await fs.readFile("feeds.json"));
    } catch (fileError) {
      return res.status(500).json({ message: "feeds.json missing/corrupt" });
    }

    // Read statuses with fallback
    let statuses = [];
    try {
      statuses = JSON.parse(await fs.readFile("statuses.json"));
    } catch (statusError) {
      console.warn("statuses.json missing—using pending fallback");
      // No return 500—proceed with pending status
    }

    const id = req.params.id;

    // Find feed (always exists or 404)
    const feed = feeds.find((f) => f.channel === id);
    if (!feed) {
      return res.status(404).json({ message: "Metadata not found" });
    }

    // Find status or fallback to pending
    const status = statuses.find((s) => s.channel === id) || { 
      status: "pending", 
      checked_at: "N/A" 
    };

    // Full mock channels.xlsx data (from your history; expand as needed)
    const channelData = {
      ONE: {
        email: "member@rhythmaura.digital",
        brandName: "The Emmanuelatere2000's Podcast",
        dateCreated: "24-09-2025",
        dateSubmitted: "24-09-2025",
        link: "https://music.amazon.co.uk/podcasts/c40177c1-4854-4ef6-bff0-9742e23db7fe/the-emmanuelatere2000s-podcast"
      },
      TWO: {
        email: "admin@vibehaven.life",
        brandName: "First Ever",
        dateCreated: "24-09-2025",
        dateSubmitted: "24-09-2025",
        link: "https://music.amazon.co.uk/podcasts/e98af407-64c1-410e-9427-a5acdecd4c69/first-ever"
      },
      THREE: {
        email: "music@sonicwave.quest",
        brandName: "WINNER",
        dateCreated: "25-09-2025",
        dateSubmitted: "25-09-2025",
        link: "https://music.amazon.co.uk/podcasts/9d5b04c1-f84f-4c29-9021-2730081ddbf6"
      },
      FOUR: {
        email: "studio@melodydock.shop",
        brandName: "The ateree91’s Podcast",
        dateCreated: "25-09-2025",
        dateSubmitted: "25-09-2025",
        link: "https://music.amazon.co.uk/podcasts/b8bd4d1a-13dd-4a3e-9586-996044e0bd57"
      },
      FIVE: {
        email: "info@temposphere.fit",
        brandName: "The uofcumbria's Podcast",
        dateCreated: "25-09-2025",
        dateSubmitted: "25-09-2025",
        link: "https://music.amazon.co.uk/podcasts/a98f0103-fd7c-480c-9b2d-7a3f781e7443"
      },
      SIX: {
        email: "support@lyricaflow.online",
        brandName: "RAR",
        dateCreated: "25-09-2025",
        dateSubmitted: "25-09-2025",
        link: "https://music.amazon.co.uk/podcasts/c1808d0c-cf09-4c47-92aa-3b9449d71602"
      },
      SEVEN: {
        email: "connect@pulsetunes.click",
        brandName: "Swaer",
        dateCreated: "25-09-2025",
        dateSubmitted: "25-09-2025",
        link: "https://music.amazon.co.uk/podcasts/648e8946-f143-42a4-8b85-1af265489e7f/rar"
      },
      EIGHT: {
        email: "contact@echobeats.quest",
        brandName: "Pore",
        dateCreated: "25-09-2025",
        dateSubmitted: "25-09-2025",
        link: "https://music.amazon.co.uk/podcasts/6289f561-5829-4aff-9fbb-77f545c905dc/pore"
      },
      NINE: {
        email: "contact@groovenest.digital",
        brandName: "The atswagger2's Podcast",
        dateCreated: "25-09-2025",
        dateSubmitted: "25-09-2025",
        link: "https://music.amazon.co.uk/podcasts/eb389f0a-8213-4b85-ad02-6db0f891fa57"
      },
      TEN: {
        email: "connect@chillnova.online",
        brandName: "CHRIS RICHES",
        dateCreated: "25-09-2025",
        dateSubmitted: "25-09-2025",
        link: "https://music.amazon.co.uk/podcasts/b1942960-72c7-42ba-a926-ea5302af1d35"
      }
    };

    const metadata = {
      ...feed,
      ...status,
      ...channelData[id],
    };

    res.json(metadata);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Step 4: Mock dashboard endpoints for local testing (Repo A fallback)
app.get("/api/dashboard/stats", (req, res) => {
  res.json({
    totalChannels: 10,
    activeFeeds: 8,
    avgStatus: 95
  });
});

app.get("/api/dashboard/recent-activity", (req, res) => {
  res.json([
    { id: 1, action: "Feed checked for ONE", timestamp: "2025-10-06T10:00:00Z" },
    { id: 2, action: "Upload completed for TWO", timestamp: "2025-10-06T09:00:00Z" }
  ]);
});

app.get("/api/dashboard/metrics-history", (req, res) => {
  res.json([
    { date: "2025-10-01", value: 90 },
    { date: "2025-10-02", value: 95 },
    { date: "2025-10-03", value: 92 }
  ]);
});

// Step 7: Health endpoint for monitoring
app.get("/api/health", (req, res) => {
  res.json({ ok: true, feeds: feeds ? feeds.length : 0 });
});

// Step 8b: Manual TuneIn status override (admin POST)
app.post("/api/feeds/:channel/status", async (req, res) => {
  const { channel } = req.params;
  const { status } = req.body;  // e.g., { "status": "approved" }
  try {
    const feeds = JSON.parse(await fs.readFile("feeds.json"));
    const feed = feeds.find(f => f.channel === channel && f.platform === "TuneIn");
    if (feed) {
      feed.tunein_status = status;
      await fs.writeFile("feeds.json", JSON.stringify(feeds, null, 2));
      io.emit('feedUpdated', { channel, tunein_status: status });
      res.json({ message: "TuneIn status updated" });
    } else {
      res.status(404).json({ message: "Feed not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
});

// Socket.io setup
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Emit on feed update (example - trigger on health check or upload)
  socket.emit('feedUpdated', { channel: 'ONE', status: 'ok' });  // Your snippet

  // Listen for client events (e.g., from Dashboard refresh)
  socket.on('requestUpdate', () => {
    // Emit to all or specific
    io.emit('feedUpdated', { channel: 'ALL', status: 'refreshed' });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Step 5: Background health check job (every 5 mins) + Socket emit
cron.schedule("*/5 * * * *", () => {
  console.log("Running background health check...");
  exec("python check_feeds.py", (error, stdout, stderr) => {
    if (error) {
      console.error("Health check failed:", error);
      return;
    }
    console.log("Health check complete:", stdout);
    // Emit to all clients
    io.emit("feedUpdated", { channel: "ALL", status: "refreshed" });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server + Socket.io running on port ${PORT}`));

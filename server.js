const express = require("express");
const cors = require("cors");  // npm i cors
const http = require("http");
const socketIo = require("socket.io");  // npm i socket.io

const app = express();
const server = http.createServer(app);  // http for Socket.io
const io = socketIo(server, { cors: { origin: "http://localhost:3000" } });  // CORS for frontend

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

// Metadata endpoint (from your metadata.js)
app.get("/api/metadata/:id", async (req, res) => {
  try {
    // ... (your full metadata code here - from previous fix)
    const feeds = JSON.parse(await fs.readFile("feeds.json"));
    // etc. (paste the full /metadata logic)
    res.json(metadata);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server + Socket.io running on port ${PORT}`));

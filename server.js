const express = require("express");
const cors = require("cors");  // npm i cors for cross-origin (frontend:3000)
const http = require("http");
const socketIo = require("socket.io");  // npm i socket.io
const fs = require("fs").promises;
const cron = require("node-cron");  // npm i node-cron for background job
const { exec } = require("child_process");  // For running Python
const AWS = require("aws-sdk");  // npm i aws-sdk for Secrets Manager

// AWS Secrets Manager setup (no keys—uses IAM role; local: set AWS_ACCESS_KEY_ID env)
AWS.config.update({
  region: 'us-east-1',  // Your region (change if different)
});
const secretsManager = new AWS.SecretsManager();

// Load creds from AWS on startup (your full .env as JSON from vault)
let creds = {};  // Global for use in endpoints
const loadSecrets = async () => {
  try {
    const data = await secretsManager.getSecretValue({ SecretId: '/prod/podcasts/creds' }).promise();
    creds = JSON.parse(data.SecretString);
    console.log('Full secrets loaded from AWS Secrets Manager (50 channels)');
  } catch (error) {
    console.error('Failed to load secrets:', error);
    creds = {};  // Fallback empty—use mocks for local
  }
};
loadSecrets();  // Run on start

const app = express();
const server = http.createServer(app);  // http for Socket.io
const io = socketIo(server, { cors: { origin: "http://localhost:3000" } });  // CORS for frontend

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));  // Allow React dev server

// Metadata endpoint (your resilient version, with AWS creds for emails)
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

    // Full lengthy mock channels.xlsx data (your history; emails from AWS creds or fallback)
    const channelData = {
      ONE: {
        email: creds.AMAZON_CH1_EMAIL || "member@rhythmaura.digital",
        brandName: "The Emmanuelatere2000's Podcast",
        dateCreated: "24-09-2025",
        dateSubmitted: "24-09-2025",
        link: "https://music.amazon.co.uk/podcasts/c40177c1-4854-4ef6-bff0-9742e23db7fe/the-emmanuelatere2000s-podcast"
      },
      TWO: {
        email: creds.AMAZON_CH2_EMAIL || "admin@vibehaven.life",
        brandName: "First Ever",
        dateCreated: "24-09-2025",
        dateSubmitted: "24-09-2025",
        link: "https://music.amazon.co.uk/podcasts/e98af407-64c1-410e-9427-a5acdecd4c69/first-ever"
      },
      THREE: {
        email: creds.AMAZON_CH3_EMAIL || "music@sonicwave.quest",
        brandName: "WINNER",
        dateCreated: "25-09-2025",
        dateSubmitted: "25-09-2025",
        link: "https://music.amazon.co.uk/podcasts/9d5b04c1-f84f-4c29-9021-2730081ddbf6"
      },
      FOUR: {
        email: creds.AMAZON_CH4_EMAIL || "studio@melodydock.shop",
        brandName: "The ateree91’s Podcast",
        dateCreated: "25-09-2025",
        dateSubmitted: "25-09-2025",
        link: "https://music.amazon.co.uk/podcasts/b8bd4d1a-13dd-4a3e-9586-996044e0bd57"
      },
      FIVE: {
        email: creds.AMAZON_CH5_EMAIL || "info@temposphere.fit",
        brandName: "The uofcumbria's Podcast",
        dateCreated: "25-09-2025",
        dateSubmitted: "25-09-2025",
        link: "https://music.amazon.co.uk/podcasts/a98f0103-fd7c-480c-9b2d-7a3f781e7443"
      },
      SIX: {
        email: creds.AMAZON_CH6_EMAIL || "support@lyricaflow.online",
        brandName: "RAR",
        dateCreated: "25-09-2025",
        dateSubmitted: "25-09-2025",
        link: "https://music.amazon.co.uk/podcasts/c1808d0c-cf09-4c47-92aa-3b9449d71602"
      },
      SEVEN: {
        email: creds.AMAZON_CH7_EMAIL || "connect@pulsetunes.click",
        brandName: "Swaer",
        dateCreated: "25-09-2025",
        dateSubmitted: "25-09-2025",
        link: "https://music.amazon.co.uk/podcasts/648e8946-f143-42a4-8b85-1af265489e7f/rar"
      },
      EIGHT: {
        email: creds.AMAZON_CH8_EMAIL || "contact@echobeats.quest",
        brandName: "Pore",
        dateCreated: "25-09-2025",
        dateSubmitted: "25-09-2025",
        link: "https://music.amazon.co.uk/podcasts/6289f561-5829-4aff-9fbb-77f545c905dc/pore"
      },
      NINE: {
        email: creds.AMAZON_CH9_EMAIL || "contact@groovenest.digital",
        brandName: "The atswagger2's Podcast",
        dateCreated: "25-09-2025",
        dateSubmitted: "25-09-2025",
        link: "https://music.amazon.co.uk/podcasts/eb389f

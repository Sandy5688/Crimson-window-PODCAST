const express = require("express");
const cors = require("cors");  // npm i cors for cross-origin (frontend:3000)
const fs = require("fs").promises;
const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));  // Allow React dev server

app.get("/api/metadata/:id", async (req, res) => {
  try {
    // Read files with error guard
    let feeds, statuses;
    try {
      feeds = JSON.parse(await fs.readFile("feeds.json"));
      statuses = JSON.parse(await fs.readFile("statuses.json"));
    } catch (fileError) {
      return res.status(500).json({ message: "Data files missing/corrupt" });
    }

    const id = req.params.id;

    // Find feed and status by channel ID (url array handled in merge)
    const feed = feeds.find((f) => f.channel === id);
    const status = statuses.find((s) => s.channel === id);

    if (!feed || !status) {
      return res.status(404).json({ message: "Metadata not found" });
    }

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const fs = require("fs").promises;
const app = express();

app.use(express.json());

app.get("/api/metadata/:id", async (req, res) => {
  try {
    const feeds = JSON.parse(await fs.readFile("feeds.json"));
    const statuses = JSON.parse(await fs.readFile("statuses.json"));
    const id = req.params.id;

    // Find feed and status by channel ID
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
      // Add other channels as needed
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

app.listen(5000, () => console.log("Server running on port 5000"));

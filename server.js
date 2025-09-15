// server.js

import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

// ✅ Nearby Places Proxy
app.get("/api/places", async (req, res) => {
  const { lat, lng, radius = 1500, type = "tourist_attraction" } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "lat and lng are required" });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${process.env.VITE_GOOGLE_PLACE_API_KEY}`
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Places API Error:", error.message);
    res.status(500).json({ error: "Failed to fetch places" });
  }
});

// ✅ Start server
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);

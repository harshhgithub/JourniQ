// routes/airports.js
import express from "express";
import axios from "axios";

const router = express.Router();

// Get Amadeus token
async function getToken() {
  const res = await axios.post(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.AMADEUS_CLIENT_ID,
      client_secret: process.env.AMADEUS_CLIENT_SECRET,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  return res.data.access_token;
}

// Airport autocomplete
router.get("/", async (req, res) => {
  try {
    const { keyword } = req.query;
    const token = await getToken();

    const resp = await axios.get(
      "https://test.api.amadeus.com/v1/reference-data/locations",
      {
        params: {
          subType: "AIRPORT,CITY",
          keyword,
          page: { limit: 5 },
        },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    res.json(resp.data);
  } catch (err) {
    console.error("Airport API error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch airports" });
  }
});

export default router;

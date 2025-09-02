// server.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());

const PORT = 5000;

// Flights API endpoint
app.get("/api/flights", async (req, res) => {
  const { origin, destination, departureDate, adults, max } = req.query;

  try {
    // Get Access Token
    const tokenRes = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.AMADEUS_API_KEY,
        client_secret: process.env.AMADEUS_API_SECRET,
      }),
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Fetch flight offers
    const flightRes = await fetch(
      `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=${adults || 1}&max=${max || 4}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!flightRes.ok) {
      const txt = await flightRes.text();
      throw new Error(txt || `Flight API error ${flightRes.status}`);
    }

    const flights = await flightRes.json();
    res.status(200).json(flights);
  } catch (err) {
    console.error("Flights API error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

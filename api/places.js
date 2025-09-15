// api/places.js
export default async function handler(req, res) {
  try {
    const { lat, lng, radius = 1500, type = "tourist_attraction" } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: "lat and lng are required" });
    }

    const apiKey = process.env.VITE_GOOGLE_PLACE_API_KEY; // set this in Vercel project settings

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    console.error("Vercel API error:", error);
    return res.status(500).json({ error: "Failed to fetch places" });
  }
}

import { GoogleGenerativeAI } from "@google/generative-ai";

// Load API key
const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Use faster + cheaper model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Faster generation config
const generationConfig = {
  temperature: 0.8,
  topP: 0.9,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

// Keep chatSession but trimmed history (lighter context = faster)
export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: `You are a travel planner AI.
Always return ONLY valid JSON in this format:

{
  "hotel_options": [
    {
      "name": "Hotel Name",
      "address": "Address",
      "price": "Price",
      "image_url": "Image",
      "geo_coordinates": "lat,long",
      "rating": "X.X stars",
      "description": "Short description"
    }
  ],
  "itinerary": [
    {
      "day": "Day 1",
      "plan": [
        {
          "place": "Attraction Name",
          "details": "Short description",
          "ticket_pricing": "Entry fee or 'Free'"
        }
      ]
    },
    {
      "day": "Day 2",
      "plan": [ ... ]
    },
    {
      "day": "Day 3",
      "plan": [ ... ]
    }
  ]
}

⚠️ Rules:
- Always generate the SAME number of days as requested by the user (e.g., if asked for 3 days, return exactly Day 1, Day 2, Day 3).
- Each day must include at least 3 time slots: morning, afternoon, evening.
- Every plan item MUST have "ticket_pricing" (even if it's "Free").
- No markdown, no commentary. Pure JSON only.`,
        },
      ],
    },
  ],
});

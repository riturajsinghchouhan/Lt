import express from "express";
import axios from "axios";

const router = express.Router();

// ✅ Your OpenRouteService API key
const API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImM2ZWY0ZmJhMDUxNDRlMGJiOGUyYjVmYjJiOWVhZjg2IiwiaCI6Im11cm11cjY0In0=";

// ✅ Fixed bakery address
const BAKERY_ADDRESS = "Rajendra Nagar, Indore";  // <-- apna bakery address likh lo

// Helper function to get coordinates from place name
async function getCoordinates(place) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`;
  const res = await axios.get(url);
  if (res.data.length === 0) throw new Error("Location not found");
  return [parseFloat(res.data[0].lon), parseFloat(res.data[0].lat)];
}

// Route: /distance/order
router.post("/order", async (req, res) => {
  try {
    const { userAddress } = req.body;  // 👈 frontend se aayega

    // Bakery (fixed) and User (dynamic)
    const [from, to] = await Promise.all([
      getCoordinates(BAKERY_ADDRESS),
      getCoordinates(userAddress),
    ]);

    const response = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car",
      { coordinates: [from, to] },
      { headers: { Authorization: API_KEY } }
    );

    const distance = (response.data.routes[0].summary.distance / 1000).toFixed(2);
    const duration = (response.data.routes[0].summary.duration / 60).toFixed(1);

    res.json({
      bakeryAddress: BAKERY_ADDRESS,
      userAddress,
      distance: `${distance} km`,
      time: `${duration} min`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to calculate distance" });
  }
});

export default router;

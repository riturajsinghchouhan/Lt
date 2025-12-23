import express from "express";
import axios from "axios";

const router = express.Router();

// ⭐ REAL API KEY
const API_KEY =
  "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImM2ZWY0ZmJhMDUxNDRlMGJiOGUyYjVmYjJiOWVhZjg2IiwiaCI6Im11cm11cjY0In0=";

// ⭐ FIXED bakery address
const BAKERY_ADDRESS = "Rajendra Nagar, Indore, Madhya Pradesh, India";

/* -----------------------------------------------------------
   ⭐ VALID AREAS (same as PaymentGateway frontend)
------------------------------------------------------------ */
const VALID_AREAS = [
  "vijay nagar",
  "rajendra nagar",
  "palasia",
  "bhawarkuan",
  "scheme 78",
  "scheme 140",
  "sudama nagar",
  "ab road",
  "pipliyahana",
  "mr 10",
  "airport road",
  "musakhedi",
  "bengali square",
  "nanda nagar",
  "geeta bhawan",
  "navlakha",
  "khajrana",
  "khandwa road"
];

/* -----------------------------------------------------------
   ⭐ STRICT NORMALIZE (safe)
------------------------------------------------------------ */
function normalizeAddress(addr) {
  if (!addr || !addr.trim()) return null;

  let a = addr.trim().toLowerCase();

  // 🔥 Match only real areas, else reject
  const matched = VALID_AREAS.find((area) => a.includes(area));
  if (!matched) {
    return null; // ❌ invalid, backend rejects same as frontend
  }

  // Capitalize properly
  const fixedArea = matched.replace(/\b\w/g, (c) => c.toUpperCase());

  return `${fixedArea}, Indore, Madhya Pradesh, India`;
}

/* -----------------------------------------------------------
   ⭐ NOMINATIM → Convert place to coordinates
------------------------------------------------------------ */
async function getCoordinates(place) {
  const url =
    "https://nominatim.openstreetmap.org/search?format=json&q=" +
    encodeURIComponent(place);

  const res = await axios.get(url, { timeout: 10000 });

  if (!res.data || res.data.length === 0) {
    const err = new Error("Location not found");
    err.code = "LOC_NOT_FOUND";
    throw err;
  }

  return [parseFloat(res.data[0].lon), parseFloat(res.data[0].lat)];
}

/* -----------------------------------------------------------
   ⭐ MAIN ROUTE: /distance/order
------------------------------------------------------------ */
router.post("/order", async (req, res) => {
  try {
    const { userAddress } = req.body;

    if (!userAddress) {
      return res.status(400).json({ error: "User address missing" });
    }

    const normalized = normalizeAddress(userAddress);

    if (!normalized) {
      return res.status(400).json({
        error:
          "Invalid user address. Please enter a valid Indore location (e.g., Vijay Nagar, Rajendra Nagar)"
      });
    }

    const [from, to] = await Promise.all([
      getCoordinates(BAKERY_ADDRESS),
      getCoordinates(normalized)
    ]);

    const orsRes = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car",
      { coordinates: [from, to] },
      {
        headers: {
          Authorization: API_KEY,
          "Content-Type": "application/json"
        },
        timeout: 15000
      }
    );

    const summary = orsRes?.data?.routes?.[0]?.summary;

    if (!summary) {
      throw new Error("Invalid routing response");
    }

    const distance = (summary.distance / 1000).toFixed(2);
    const time = (summary.duration / 60).toFixed(1);

    return res.json({
      bakeryAddress: BAKERY_ADDRESS,
      userAddress: normalized,
      distance: `${distance} km`,
      time: `${time} min`
    });
  } catch (err) {
    console.error("DISTANCE ERROR:", err.message);

    if (err.code === "LOC_NOT_FOUND") {
      return res.status(400).json({ error: "Address not found on map" });
    }

    return res
      .status(500)
      .json({ error: "Failed to calculate distance. Try another address." });
  }
});

export default router;

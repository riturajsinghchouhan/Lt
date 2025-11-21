import React, { useState, useEffect } from "react";
import axios from "axios";
import { orderapi } from "../../Api_url";

const DistanceChecker = () => {
  const [userAddress, setUserAddress] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("_id"); // user id from localStorage

  // Fetch latest order address from database
  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const res = await axios.get(`${orderapi}orders?userId=${userId}`);
        if (res.data && res.data.length > 0) {
          // Get last order (latest)
          const lastOrder = res.data[res.data.length - 1];
          if (lastOrder.location) {
            setUserAddress(lastOrder.location);
            console.log("✅ User Address (from DB):", lastOrder.location); // 👈 Console log here
          } else {
            console.warn("⚠️ No address found in the latest order.");
            setError("No address found in your latest order.");
          }
        } else {
          console.warn("⚠️ No orders found for this user.");
          setError("No orders found for your account.");
        }
      } catch (err) {
        console.error("❌ Error fetching orders:", err);
        setError("Failed to fetch order details.");
      }
    };

    if (userId) fetchUserAddress();
  }, [userId]);

  const handleCheckDistance = async () => {
    if (!userAddress) {
      setError("User address not found in your order data.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await axios.post("http://localhost:3001/distance/order", {
        userAddress,
      });
      setResult(res.data);
      console.log("📦 Distance API Response:", res.data); // 👈 Also log API response
    } catch (err) {
      console.error("❌ Distance API Error:", err);
      setError("Failed to get distance. Please check the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "40px auto",
        padding: "20px",
        background: "#fff8f0",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      <h2 style={{ color: "#ff6f00" }}>🚚 Delivery Distance Checker</h2>

      <div style={{ marginTop: "15px" }}>
        <input
          type="text"
          value={userAddress}
          readOnly
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            background: "#f9f9f9",
          }}
        />
      </div>

      <button
        onClick={handleCheckDistance}
        disabled={loading || !userAddress}
        style={{
          marginTop: "15px",
          padding: "10px 20px",
          background: "#ff6f00",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        {loading ? "Calculating..." : "Check Distance"}
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {result && (
        <div
          style={{
            marginTop: "25px",
            background: "#fff3e0",
            padding: "15px",
            borderRadius: "10px",
            textAlign: "left",
          }}
        >
          <h3>📍 Delivery Details</h3>
          <p>
            <strong>Bakery:</strong> {result.bakeryAddress}
          </p>
          <p>
            <strong>Your Address:</strong> {result.userAddress}
          </p>
          <p>
            <strong>Distance:</strong> {result.distance}
          </p>
          <p>
            <strong>Estimated Time:</strong> {result.time}
          </p>
        </div>
      )}
    </div>
  );
};

export default DistanceChecker;

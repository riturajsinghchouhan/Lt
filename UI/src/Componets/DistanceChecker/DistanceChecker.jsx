import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const DistanceChecker = () => {
  const { state } = useLocation();
  const [userAddress, setUserAddress] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!state || !state.userAddress) {
      setError("No address received. Please select an order.");
      return;
    }
    setUserAddress(state.userAddress);
  }, [state]);

  const handleCheckDistance = async () => {
    if (!userAddress) {
      setError("No address available.");
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
    } catch (err) {
      console.error("Distance error:", err);
      setError("Failed to calculate distance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "0 auto" }}>
      <h2>🚚 Delivery Distance Checker</h2>

      <input
        type="text"
        value={userAddress}
        readOnly
        style={{
          width: "100%",
          padding: 10,
          marginTop: 10,
          border: "1px solid #ccc",
        }}
      />

      <button
        onClick={handleCheckDistance}
        style={{
          marginTop: 20,
          background: "orange",
          padding: 10,
          border: "none",
          color: "#fff",
        }}
      >
        {loading ? "Checking..." : "Check Distance"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 20, background: "#eee", padding: 10 }}>
          <p><b>Bakery:</b> {result.bakeryAddress}</p>
          <p><b>Your Address:</b> {result.userAddress}</p>
          <p><b>Distance:</b> {result.distance}</p>
          <p><b>ETA:</b> {result.time}</p>
        </div>
      )}
    </div>
  );
};

export default DistanceChecker;

import React, { useEffect, useState } from "react";
import "./UserCustomOrders.css";

// Helper function to format dates consistently
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

function UserCustomOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("_id");

    if (!userId) {
      console.error("User not logged in!");
      setLoading(false);
      return;
    }

    // Best practice: Store API URL in an environment variable
    const API_URL = `http://localhost:3001/customcake/user/${userId}`;

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setOrders(data.orders);
        } else {
          console.error("Error fetching orders:", data.error);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      })
      .finally(() => {
        // .finally ensures setLoading(false) runs in all cases
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="loading-message">Loading your cake orders...</p>;

  return (
    // Use a main wrapper div or React.Fragment
    <div className="custom-orders-page">
      {/* 1. Title is now OUTSIDE the grid container to allow it to be centered */}
      <h2>🎂 My Custom Cake Orders</h2>

      <div className="orders-container">
        {orders.length === 0 ? (
          <p className="no-orders">You haven't ordered any custom cakes yet.</p>
        ) : (
          orders.map((o) => (
            // 2. Use a unique ID like o._id for the key, not the index
            <div className="order-card" key={o._id}>
              <p><b>Base:</b> {o.base}</p>
              <p><b>Shape:</b> {o.shape}</p>
              <p><b>Weight:</b> {o.weight} kg</p>
              <p><b>Flavor:</b> {o.flavor}</p>
              <p><b>Toppings:</b> {o.toppings.join(", ")}</p>
              <p><b>Message:</b> {o.message || "No message"}</p>
              <p><b>Total:</b> ₹{o.total}</p>
              {/* 3. Formatted the delivery date for better readability */}
              <p><b>Delivery Date:</b> {formatDate(o.deliveryDate)}</p>
              <p>
                <b>Ordered On:</b>{" "}
                {new Date(o.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>

              {o.image && (
                <img
                  src={`http://localhost:3001/${o.image}`}
                  alt="Custom cake design"
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserCustomOrders;
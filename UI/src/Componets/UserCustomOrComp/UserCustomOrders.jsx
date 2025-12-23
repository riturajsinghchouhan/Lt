import React, { useEffect, useState } from "react";
import "./UserCustomOrders.css";

// Format date function
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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const userId = localStorage.getItem("_id");

  // Fetch paginated custom orders
  const fetchCustomOrders = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:3001/customcake/user/${userId}?page=${page}&limit=10`
      );

      const data = await res.json();

      if (data.success) {
        setOrders((prev) => [...prev, ...data.orders]); // append data
        setHasMore(data.hasMore);
      }

    } catch (err) {
      console.error("Fetch error:", err);

    } finally {
      setLoading(false);
    }
  };

  // Fetch on page change
  useEffect(() => {
    fetchCustomOrders();
  }, [page]);

  return (
    <div className="custom-orders-page">
      <h2>🎂 My Custom Cake Orders</h2>

      <div className="orders-container">
        {orders.length === 0 && !loading ? (
          <p className="no-orders">You haven't ordered any custom cakes yet.</p>
        ) : (
          orders.map((o) => (
            <div className="order-card" key={o._id}>
              <p><b>Base:</b> {o.base}</p>
              <p><b>Shape:</b> {o.shape}</p>
              <p><b>Weight:</b> {o.weight} kg</p>
              <p><b>Flavor:</b> {o.flavor}</p>
              <p><b>Toppings:</b> {o.toppings.join(", ")}</p>
              <p><b>Message:</b> {o.message || "No message"}</p>
              <p><b>Total:</b> ₹{o.total}</p>
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

      {/* Load More Button */}
      {hasMore && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            className="load-more-btn"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More Orders"}
          </button>
        </div>
      )}

      {loading && <p className="loading-message">Loading...</p>}
    </div>
  );
}

export default UserCustomOrders;

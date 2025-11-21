import "./MyOrders.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { orderapi } from "../../Api_url";
import { useNavigate } from "react-router-dom";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [timers, setTimers] = useState({});
  const userId = localStorage.getItem("_id");
  const navigate = useNavigate();

  // Fetch orders and setup timers
  useEffect(() => {
    axios
      .get(`${orderapi}orders?userId=${userId}`)
      .then((res) => {
        const fetchedOrders = res.data;
        setOrders(fetchedOrders);

        const newTimers = {};
        fetchedOrders.forEach((order) => {
          if (order.status === "Pending") {
            const orderPlacedTime = new Date(order.createdAt).getTime();
            const now = new Date().getTime();
            const secondsPassed = Math.floor((now - orderPlacedTime) / 1000);
            const timeLeft = 300 - secondsPassed;

            if (timeLeft > 0) {
              newTimers[order._id] = timeLeft;
            } else {
              cancelOrder(order._id); // Auto cancel
            }
          }
        });
        setTimers(newTimers);
      })
      .catch((err) => {
        console.error("Order fetch error:", err);
        setError("Failed to load orders.");
      });
  }, [userId]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const updated = { ...prev };
        for (let id in updated) {
          if (updated[id] > 0) {
            updated[id] -= 1;
          } else {
            cancelOrder(id);
            delete updated[id];
          }
        }
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cancel order via API
  const cancelOrder = (orderId) => {
    axios
      .post(`${orderapi}cancel`, { orderId })
      .then(() => {
        // Update orders status
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: "Cancelled" } : o
          )
        );
        // Stop the timer
        setTimers((prev) => {
          const updated = { ...prev };
          delete updated[orderId];
          return updated;
        });
      })
      .catch((err) => console.error("Cancel order error:", err));
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="my-orders-wrapper">
      <h2 className="my-orders-title">My Orders</h2>

      {error ? (
        <p className="error-text">{error}</p>
      ) : orders.length === 0 ? (
        <p>You have not placed any orders yet.</p>
      ) : (
        <table className="my-orders-table">
          <thead>
            <tr>
              <th>Cake</th>
              <th>Weight</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Message</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Location</th>
              <th>Order Time</th>
              <th>Cancel Timer</th>
              <th>Track</th> {/* 🆕 Added column */}
            </tr>
          </thead>
          <tbody>
  {orders.map((order) => (
    <tr key={order._id}>
      <td>{order.cake}</td>
      <td>{order.weight}</td>
      <td>{order.quantity}</td>
      <td>₹{order.total}</td>
      <td>{order.message}</td>
      <td>{order.paymentMode}</td>
      <td
        className={
          order.status === "Delivered"
            ? "status-delivered"
            : order.status === "Cancelled"
            ? "status-cancelled"
            : "status-pending"
        }
      >
        {order.status}
      </td>
      <td>{order.location || "N/A"}</td>
      <td>{new Date(order.createdAt).toLocaleString()}</td>
      <td>
        {order.status === "Pending" && timers[order._id] ? (
          <>
            <div className="cancel-cell">{formatTime(timers[order._id])}</div>
            <button
              className="cancel-button"
              onClick={() => {
                if (window.confirm("Are you sure you want to cancel this order?")) {
                  cancelOrder(order._id);
                }
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          order.status
        )}
      </td>

      {/* 🟢 NEW COLUMN: Track Order */}
      <td>
        <button
          className="track-button"
          onClick={() =>
            navigate("/distance-check", {
              state: { userAddress: order.location },
            })
          }
        >
          Track Order
        </button>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      )}
    </div>
  );
}

export default MyOrders;

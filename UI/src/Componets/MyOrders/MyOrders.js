import "./MyOrders.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { orderapi } from "../../Api_url";
import { useNavigate } from "react-router-dom";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [timers, setTimers] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("_id");
  const navigate = useNavigate();

  // ------------------------------
  // Fetch Orders (Paginated)
  // ------------------------------
  const fetchOrders = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);

      const res = await axios.get(
        `${orderapi}orders?userId=${userId}&page=${page}&limit=10`
      );

      if (!res.data.success) {
        setError("Failed to load orders.");
        return;
      }

      const newOrders = res.data.orders;
      const more = res.data.hasMore;

      // 🔥 Avoid duplicate order IDs when loading more pages
      setOrders((prev) => {
        const existingIds = new Set(prev.map((o) => o._id));
        const filtered = newOrders.filter((o) => !existingIds.has(o._id));
        return [...prev, ...filtered];
      });

      setHasMore(more);

      // Timers for NEW items only
      const newTimers = {};
      newOrders.forEach((order) => {
        if (order.status === "Pending") {
          const placed = new Date(order.createdAt).getTime();
          const now = Date.now();
          const secPassed = Math.floor((now - placed) / 1000);
          const left = 300 - secPassed;
          if (left > 0) newTimers[order._id] = left;
        }
      });

      setTimers((prev) => ({ ...prev, ...newTimers }));
    } catch (err) {
      console.error(err);
      setError("Network Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  // ------------------------------
  // Countdown Timers
  // ------------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const updated = { ...prev };

        Object.keys(updated).forEach((id) => {
          if (updated[id] > 0) updated[id]--;
          else {
            cancelOrder(id);
            delete updated[id];
          }
        });

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ------------------------------
  // Cancel Order
  // ------------------------------
const cancelOrder = (orderId) => {
  const userName = localStorage.getItem("name"); // 👈 Add this

  axios.post(`${orderapi}cancel`, { orderId, userId, userName })  // 👈 add userName
    .then(() => {
      setOrders(prev =>
        prev.map(o => (o._id === orderId ? { ...o, status: "Cancelled" } : o))
      );
    })
    .catch(err => console.error("Cancel order error:", err));
};


        // Remove timer

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="my-orders-wrapper">
      <h2 className="my-orders-title">My Orders</h2>

      {error && <p className="error-text">{error}</p>}

      {orders.length === 0 && !loading ? (
        <p>You have not placed any orders yet.</p>
      ) : (
        <>
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
                <th>Cancel</th>
                <th>Track</th>
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
                  <td className={`status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </td>
                  <td>{order.location || "N/A"}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>

                  <td>
                    {order.status === "Pending" && timers[order._id] ? (
                      <>
                        <div className="cancel-cell">
                          {formatTime(timers[order._id])}
                        </div>

                        <button
                          className="cancel-button"
                          onClick={() => {
                            if (window.confirm("Cancel this order?")) {
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

                  <td>
                    <button
                      className="track-button"
                      onClick={() => {
                        navigate("/distance-check", {
                          state: {
                            userAddress:
                              order.location?.trim() ||
                              order.address?.trim() ||
                              "",
                          },
                        });
                      }}
                    >
                      Track
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {hasMore && (
            <div className="load-more-container">
              <button
                className="load-more-btn"
                onClick={() => setPage((p) => p + 1)}
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MyOrders;

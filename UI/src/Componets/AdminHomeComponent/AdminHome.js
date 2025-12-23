import "./AdminHome.css";
import axios from "axios";
import { useEffect, useState } from "react";

function AdminHome() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/notifications")
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error("Notification error:", err));
  }, []);

  return (
    <div className="admin-home-page">

      {/* PAGE TITLE */}
      <h2 className="welcome-title">Admin Dashboard</h2>

      {/* NORMAL NOTIFICATION SECTION */}
      <div className="notif-section">
        <h3 className="notif-main-title">Notifications</h3>

        {notifications.length === 0 ? (
          <p className="notif-empty">No notifications yet</p>
        ) : (
          notifications.map((n) => (
            <div key={n._id} className="notif-row">

              {/* Left side tag */}
              <span className={`notif-tag ${n.type}`}>
                {n.type === "order_cancel" ? "❌ Cancelled" : "🆕 New Order"}
              </span>

              {/* Main content */}
              <div className="notif-content">

                {/* USER NAME */}
                <p className="notif-user">
                  <b>User:</b> {n.userName || "Unknown User"}
                </p>

                {/* MESSAGE */}
                <p className="notif-message">{n.message}</p>

                {/* TIME */}
                <small className="notif-time">
                  {new Date(n.createdAt).toLocaleString()}
                </small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminHome;

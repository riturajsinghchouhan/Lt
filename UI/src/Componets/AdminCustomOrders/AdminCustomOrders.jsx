import "./AdminCustomOrders.css";
import { useEffect, useState } from "react";
import axios from "axios";

function AdminCustomOrders() {
  const [orders, setOrders] = useState([]);
  const [modalImage, setModalImage] = useState(null);

  // Filters
  const [status, setStatus] = useState("");
  const [shape, setShape] = useState("");
  const [flavor, setFlavor] = useState("");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Fetch orders with filters & pagination
  const loadOrders = () => {
    axios
      .get("http://localhost:3001/customcake/all", {
        params: {
          page,
          limit: 10,
          status,
          shape,
          flavor,
          search,
          startDate,
          endDate,
        },
      })
      .then((res) => {
        setOrders(res.data.orders || []);
        setHasMore(res.data.hasMore);
      })
      .catch((err) => console.error("Error fetching orders:", err));
  };

  useEffect(() => {
    loadOrders();
  }, [page]); // pagination change reloads

  const applyFilters = () => {
    setPage(1);
    loadOrders();
  };

  const resetFilters = () => {
    setStatus("");
    setShape("");
    setFlavor("");
    setSearch("");
    setStartDate("");
    setEndDate("");
    setPage(1);
    loadOrders();
  };

  const updateStatus = (id, status) => {
    axios
      .put(`http://localhost:3001/customcake/status/${id}`, { status })
      .then(() => {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === id ? { ...order, status } : order
          )
        );
      })
      .catch((err) => console.error("Error updating status:", err));
  };

  return (
    <div className="admin-orders-container">
      <h2 className="admin-orders-title">🎂 Custom Cake Orders (Admin)</h2>

      {/* ---------------- FILTER SECTION ---------------- */}
      <div className="custom-filter-bar">

  <input 
    type="text" 
    placeholder="Search cake/message/flavor"
    className="filter-input"
    value={search}
    onChange={(e)=>setSearch(e.target.value)}
  />

  <select 
    className="filter-select"
    value={status}
    onChange={(e)=>setStatus(e.target.value)}
  >
    <option value="">All Status</option>
    <option value="Pending">Pending</option>
    <option value="Delivered">Delivered</option>
  </select>

  <input 
    type="text"
    placeholder="Shape (Heart, Round)"
    className="filter-input"
    value={shape}
    onChange={(e)=>setShape(e.target.value)}
  />

  <input 
    type="text"
    placeholder="Flavor"
    className="filter-input"
    value={flavor}
    onChange={(e)=>setFlavor(e.target.value)}
  />

  <input 
    type="date"
    className="filter-date"
    value={startDate}
    onChange={(e)=>setStartDate(e.target.value)}
  />

  <input 
    type="date"
    className="filter-date"
    value={endDate}
    onChange={(e)=>setEndDate(e.target.value)}
  />

  <button className="filter-btn" onClick={applyFilters}>
    Apply
  </button>

  <button className="filter-reset" onClick={resetFilters}>
    Reset
  </button>

</div>


      {/* ---------------- TABLE ---------------- */}
      <div className="table-wrapper">
        <table className="admin-orders-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>User</th>
              <th>Phone</th>
              <th>Cake</th>
              <th>Base</th>
              <th>Shape</th>
              <th>Weight</th>
              <th>Qty</th>
              <th>Toppings</th>
              <th>Message</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Order Date</th>
              <th>Delivery Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>
                  {order.image ? (
                    <img
                      src={`http://localhost:3001/${order.image}`}
                      alt="Cake"
                      className="cake-thumbnail"
                      onClick={() =>
                        setModalImage(`http://localhost:3001/${order.image}`)
                      }
                    />
                  ) : (
                    "N/A"
                  )}
                </td>

                <td>{order.name || "—"}</td>
                <td>{order.mobile || "—"}</td>
                <td>{order.cakeName || "—"}</td>
                <td>{order.base}</td>
                <td>{order.shape}</td>
                <td>{order.weight} kg</td>
                <td>{order.qty}</td>
                <td>{order.toppings?.join(", ")}</td>
                <td>{order.message || "—"}</td>
                <td>₹{order.total}</td>
                <td>{order.paymentMode || "Pending"}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  {order.deliveryDate
                    ? new Date(order.deliveryDate).toLocaleDateString()
                    : "—"}
                </td>

                <td
                  className={
                    order.status === "Delivered"
                      ? "status-delivered"
                      : "status-pending"
                  }
                >
                  {order.status}
                </td>

                <td>
                  <select
                    className="status-select"
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(order._id, e.target.value)
                    }
                  >
                    <option>Pending</option>
                    <option>Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------------- PAGINATION ---------------- */}
      <div className="pagination-box">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          ⬅ Previous
        </button>

        <span>Page {page}</span>

        <button
          disabled={!hasMore}
          onClick={() => setPage((p) => p + 1)}
        >
          Next ➡
        </button>
      </div>

      {/* MODAL IMAGE VIEW */}
      {modalImage && (
        <div className="image-modal" onClick={() => setModalImage(null)}>
          <img src={modalImage} alt="Cake Large" className="modal-image" />
        </div>
      )}
    </div>
  );
}

export default AdminCustomOrders;

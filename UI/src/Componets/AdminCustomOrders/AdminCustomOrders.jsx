import './AdminCustomOrders.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function AdminCustomOrders() {
  const [orders, setOrders] = useState([]);
  const [modalImage, setModalImage] = useState(null); // <-- for modal

  useEffect(() => {
    axios.get('http://localhost:3001/customcake/all')
      .then(res => setOrders(res.data.orders || []))
      .catch(err => console.error("Error fetching orders:", err));
  }, []);

  const updateStatus = (id, status) => {
    axios.put(`http://localhost:3001/customcake/status/${id}`, { status })
      .then(() => {
        setOrders(prev =>
          prev.map(order => order._id === id ? { ...order, status } : order)
        );
      })
      .catch(err => console.error("Error updating status:", err));
  };

  return (
    <div className="admin-orders-container">
      <h2 className="admin-orders-title">🎂 Custom Cake Orders</h2>
      <div className="table-wrapper">
        <table className="admin-orders-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>User</th>
              <th>Phone</th>
              <th>Cake Name</th>
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
            {orders.map(order => (
              <tr key={order._id}>
                <td>
                  {order.image ? (
                    <img
                      src={`http://localhost:3001/${order.image}`}
                      alt="Cake"
                      className="cake-thumbnail"
                      onClick={() => setModalImage(`http://localhost:3001/${order.image}`)}
                    />
                  ) : (
                    'N/A'
                  )}
                </td>
                <td>{order.name || order.user?.name || '—'}</td>
                <td>{order.mobile || order.user?.phone || '—'}</td>
                <td>{order.cakeName || '—'}</td>
                <td>{order.base || '—'}</td>
                <td>{order.shape || '—'}</td>
                <td>{order.weight} kg</td>
                <td>{order.qty}</td>
                <td>{order.toppings?.join(', ') || 'None'}</td>
                <td>{order.message || '—'}</td>
                <td>₹{order.total}</td>
                <td>{order.paymentMode || 'Pending'}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>{order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : '—'}</td>
                <td className={order.status === 'Delivered' ? 'status-delivered' : 'status-pending'}>
                  {order.status}
                </td>
                <td>
                  <select
                    className="status-select"
                    value={order.status}
                    onChange={e => updateStatus(order._id, e.target.value)}
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

      {/* Modal for enlarged image */}
      {modalImage && (
        <div className="image-modal" onClick={() => setModalImage(null)}>
          <img src={modalImage} alt="Cake Large" className="modal-image" />
        </div>
      )}
    </div>
  );
}

export default AdminCustomOrders;

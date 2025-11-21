import './ManageOders.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { orderapi } from '../../Api_url';

function ManageOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get(orderapi + 'all').then(res => setOrders(res.data));
  }, []);

  const updateStatus = (id, status) => {
    axios.put(orderapi + 'status/' + id, { status }).then(() => {
      setOrders(prev =>
        prev.map(order =>
          order._id === id ? { ...order, status } : order
        )
      );
    });
  };

  return (
    <div className="manage-orders-wrapper">
      <h2 className="manage-orders-title">Manage Orders</h2>
      <table className="manage-orders-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Cake</th>
            <th>Weight</th>
            <th>Qty</th>
            <th>Message on cake</th>
            <th>Total</th>
            <th>Mode</th>
            <th>Location</th>
            <th>Status</th>
            <th>Action</th>
            <th>Phone</th>

          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order.name}</td>
              <td>{order.cake}</td>
              <td>{order.weight}</td>
              <td>{order.quantity}</td>
              <td>{order.message}</td>
              <td>₹{order.total}</td>
              <td>{order.paymentMode}</td>
              <td>{order.location || 'N/A'}</td>
              <td className={order.status === 'Delivered' ? 'status-delivered' : 'status-pending'}>
                {order.status}
              </td>
              <td>
                <select
                  className="manage-orders-select"
                  value={order.status}
                  onChange={e => updateStatus(order._id, e.target.value)}
                >
                  <option>Pending</option>
                  <option>Delivered</option>
                </select>
              </td>
              <td>{order.mobile}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageOrders;

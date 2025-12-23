import './ManageOders.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { orderapi } from '../../Api_url';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [searchMobile, setSearchMobile] = useState("");
  const [topCustomers, setTopCustomers] = useState([]);
  const [showTop, setShowTop] = useState(false);

  // Load filtered orders
  const loadOrders = () => {
    let url = `${orderapi}filter?type=${filter}`;

    if (filter === "monthly") {
      url = `${orderapi}filter?type=monthly&year=${year}&month=${month}`;
    }

    axios.get(url).then((res) => {
      const cleaned = res.data.map(o => ({
        ...o,
        total: Number(o.total || 0)
      }));

      setOrders(cleaned);
      calculateTopCustomers(cleaned);
    });
  };

  useEffect(() => {
    loadOrders();
  }, [filter]);

  // Update Status
  const updateStatus = (id, status) => {
    axios.put(orderapi + 'status/' + id, { status }).then(() => {
      setOrders(prev =>
        prev.map(order =>
          order._id === id ? { ...order, status } : order
        )
      );
    });
  };

  // ------------------ TOP CUSTOMERS ------------------
  const calculateTopCustomers = (data) => {
    const map = {};
    data.forEach(o => {
      if (!map[o.mobile]) {
        map[o.mobile] = {
          name: o.name,
          mobile: o.mobile,
          orders: 0,
          revenue: 0
        };
      }
      map[o.mobile].orders += 1;
      if (o.status !== "Cancelled") {
        map[o.mobile].revenue += o.total;
      }
    });

    const sorted = Object.values(map).sort((a, b) => b.orders - a.orders);
    setTopCustomers(sorted);
  };

  // ------------------ SUMMARY ------------------
  const totalOrders = orders.length;
  const delivered = orders.filter(o => o.status === "Delivered").length;
  const pending = orders.filter(o => o.status === "Pending").length;
  const cancelled = orders.filter(o => o.status === "Cancelled").length;
  const totalRevenue = orders
    .filter(o => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  // ------------------ BEST SELLING CAKE ------------------
  const bestSellingCake = () => {
    const cakeStat = {};
    orders.forEach(o => {
      if (!cakeStat[o.cake]) cakeStat[o.cake] = 0;
      cakeStat[o.cake] += o.quantity;
    });

    const sorted = Object.entries(cakeStat).sort((a, b) => b[1] - a[1]);
    if (sorted.length === 0) return null;

    return { cake: sorted[0][0], qty: sorted[0][1] };
  };

  const bestCake = bestSellingCake();

  // ------------------ SEARCH BY MOBILE ------------------
 const filteredOrders = orders.filter(order =>
  (order.mobile ?? "").toString().includes(searchMobile)
);


  // ------------------ EXPORT EXCEL ------------------
  const exportExcel = () => {
    const dataToExport = filteredOrders.map(o => ({
      Name: o.name,
      Mobile: o.mobile,
      Cake: o.cake,
      Weight: o.weight,
      Quantity: o.quantity,
      Message: o.message,
      Total: o.total,
      Payment: o.paymentMode,
      Status: o.status
    }));

    const sheet = XLSX.utils.json_to_sheet(dataToExport);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Orders");

    const buffer = XLSX.write(book, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), `orders.xlsx`);
  };

  // ------------------ PRINT INVOICE ------------------
  const printInvoice = (order) => {
    const win = window.open("", "PrintInvoice");

    win.document.write(`
      <html>
      <head>
        <title>Invoice</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          h2 { text-align: center; }
          p { font-size: 16px; margin: 5px 0; }
          .total { font-size: 20px; font-weight: bold; margin-top: 10px; }
        </style>
      </head>
      <body>
        <h2>Order Invoice</h2>

        <p><b>Name:</b> ${order.name}</p>
        <p><b>Mobile:</b> ${order.mobile}</p>
        <p><b>Cake:</b> ${order.cake}</p>
        <p><b>Weight:</b> ${order.weight}</p>
        <p><b>Quantity:</b> ${order.quantity}</p>
        <p><b>Message:</b> ${order.message}</p>
        <p><b>Payment Mode:</b> ${order.paymentMode}</p>
        <p><b>Status:</b> ${order.status}</p>

        <p class="total">Total Amount: ₹${order.total}</p>

        <script>
          window.onload = function() {
            window.print();
            window.close();
          }
        </script>
      </body>
      </html>
    `);

    win.document.close();
  };

  return (
    
    <div className="manage-orders-wrapper">
      <h2 className="manage-orders-title">Manage Orders</h2>

      {/* FILTER SECTION */}
      <div className="filter-container">
        <select 
          value={filter} 
          onChange={e => setFilter(e.target.value)}
          className="manage-orders-select"
        >
          <option value="today">Today's Sale</option>
          <option value="last_week">Last Week</option>
          <option value="last_month">Last Month</option>
          <option value="monthly">Specific Month</option>
          <option value="all">All Orders</option>
        </select>

        {filter === "monthly" && (
          <>
            <input 
              type="number" 
              placeholder="Year" 
              className="input-year" 
              value={year}
              onChange={e => setYear(e.target.value)}
            />

            <input 
              type="number" 
              placeholder="Month (1-12)" 
              className="input-month"
              value={month}
              onChange={e => setMonth(e.target.value)}
            />

            <button onClick={loadOrders} className="filter-btn">Load</button>
          </>
        )}

        <input 
          type="text"
          placeholder="Search Mobile"
          className="input-search"
          value={searchMobile}
          onChange={e => setSearchMobile(e.target.value)}
        />

        <button className="export-btn" onClick={exportExcel}>
          Export Excel
        </button>
      </div>
<button className="top-btn" onClick={() => setShowTop(!showTop)}>
  {showTop ? "Hide Top Customers" : "Show Top Customers"}
</button>

      {/* SUMMARY */}
      <div className="simple-summary">
        <p><b>Total Orders:</b> {totalOrders}</p>
        <p><b>Delivered:</b> {delivered}</p>
        <p><b>Pending:</b> {pending}</p>
        <p><b>Cancelled:</b> {cancelled}</p>
        <p><b>Total Revenue:</b> ₹{totalRevenue}</p>
      </div>

      {/* TOP CUSTOMERS + BEST CAKE */}
      {showTop && (
  <div className="top-box">
    <h3>Top Customers</h3>
    {topCustomers.slice(0, 3).map((c, i) => (
      <p key={i}>
        <b>{c.name}</b> ({c.mobile}) → {c.orders} orders | Revenue: ₹{c.revenue}
      </p>
    ))}

    {bestCake && (
      <p style={{ marginTop: "10px" }}>
        🏆 <b>Best-Selling Cake:</b> {bestCake.cake} (x{bestCake.qty})
      </p>
    )}
  </div>
)}
      {/* TABLE */}
      <table className="manage-orders-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Cake</th>
            <th>Weight</th>
            <th>Qty</th>
            <th>Message</th>
            <th>Total</th>
            <th>Mode</th>
            <th>Location</th>
            <th>Status</th>
            <th>Invoice</th>
            <th>Action</th>
            <th>Phone</th>
          </tr>
        </thead>

        <tbody>
          {filteredOrders.map(order => (
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
                <button className="invoice-btn" onClick={() => printInvoice(order)}>Invoice</button>
              </td>

              <td>
                <select
                  className="manage-orders-select"
                  value={order.status}
                  onChange={e => updateStatus(order._id, e.target.value)}
                >
                  <option>Pending</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
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

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddToCart.css";

function AddToCart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    setCartItems(storedItems);
  }, []);

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);

    localStorage.setItem("cartItems", JSON.stringify(updated));
    localStorage.setItem("cartCount", updated.length.toString());
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-wrapper">
      <h2 className="cart-title">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="empty-text">Your cart is empty.</p>
      ) : (
        <div className="table-container">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Items</th>
                <th>Title</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Remove</th>
              </tr>
            </thead>

            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <img
                      src={`http://localhost:3001/uploads/subcaticons/${item.image}`}
                      className="cart-img"
                      alt="cake"
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>
                    <div className="qty-box">{item.quantity}</div>
                  </td>
                  <td>₹{item.price * item.quantity}</td>
                  <td>
                    <button className="remove-x" onClick={() => removeItem(item.id)}>
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Cart Total Section */}
          <div className="cart-total-box">
            <h3>Cart Totals</h3>

            <div className="cart-total-row">
              <span>Subtotal</span>
              <span>₹{totalAmount}</span>
            </div>

            <div className="cart-total-row">
              <span>Delivery Fee</span>
              <span>₹50</span>
            </div>

            <div className="cart-total-row total-bold">
              <span>Total</span>
              <span>₹{totalAmount + 50}</span>
            </div>

            <button
              className="checkout-button"
              onClick={() =>
                navigate("/payment", {
                  state: {
                    total: totalAmount + 50,
                    cartItems: cartItems,
                    orderType: "cart",
                  },
                })
              }
            >
              PROCEED TO CHECKOUT 🚀
            </button>

            {/* NEW BUTTON */}
            <button
              className="add-more-btn"
              onClick={() => navigate("/")}
            >
              ➕ Add More To Cart
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

export default AddToCart;

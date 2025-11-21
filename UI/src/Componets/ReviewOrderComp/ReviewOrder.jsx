import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ReviewOrder.css";

function ReviewOrder() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return <h2>No order details found!</h2>;
  }

 const handlePayment = () => {
  navigate("/payment", { 
    state: { 
      ...state, 
      orderType: state.isCustom ? "custom" : "normal", // ✅ important for redirect
      customDetails: state.customDetails || {
        name: state.name,
        base: state.base,
        shape: state.shape,
        weight: state.weight,
        flavor: state.flavor,
        qty: state.qty,
        message: state.message,
        toppings: state.toppings,
        total: state.total,
        image: state.image,
        deliveryDate: state.deliveryDate,
      },
    }
  });
};


  return (
    <div className="review-container">
      <h2 className="title">📝 Review Your Order</h2>

      <div className="order-details">
        <p><b>Cake Name:</b> {state.name || "Custom Cake"}</p>
        {state.base && <p><b>Base:</b> {state.base}</p>}
        {state.shape && <p><b>Shape:</b> {state.shape}</p>}
        {state.weight && <p><b>Weight:</b> {state.weight} kg</p>}
        {state.flavor && <p><b>Flavor:</b> {state.flavor}</p>}
        <p>
          <b>Toppings:</b>{" "}
          {state.toppings?.length ? state.toppings.join(", ") : "None"}
        </p>
        <p><b>Message:</b> {state.message || "No message"}</p>
        {state.total && <p className="total"><b>Total:</b> ₹{state.total}</p>}
        {state.image && (
          <div>
            <b>Image:</b> <img src={state.image.url || URL.createObjectURL(state.image)} alt="Cake" className="order-image" />
          </div>
        )}
      </div>

      <button className="btn btn-warning mt-3" onClick={handlePayment}>
        ✅ Confirm Order & Go to Payment
      </button>
    </div>
  );
}

export default ReviewOrder;

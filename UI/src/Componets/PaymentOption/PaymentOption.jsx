import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { orderapi } from "../../Api_url";
import "./Payment.css";

/* ---------------------------------------------------------
   ⭐ AUTO NORMALIZE ADDRESS
---------------------------------------------------------- */
function normalizeAddress(addr) {
  if (!addr || !addr.trim()) return null;

  let a = addr.trim();

  const validAreas = [
    "vijay nagar","rajendra nagar","palasia","bhawarkuan","scheme 78","scheme 140",
    "sudama nagar","ab road","pipliyahana","mr 10","l i g","m i g",
    "airport road","musakhedi","bengali square","nanda nagar","geeta bhawan",
    "navlakha","khajrana","khandwa road"
  ];

  const lower = a.toLowerCase();
  const matched = validAreas.find(area => lower.includes(area));
  if (!matched) return null;

  return `${matched.replace(/\b\w/g, c => c.toUpperCase())}, Indore, Madhya Pradesh, India`;
}

function PaymentGateway() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [gatewayMessage, setGatewayMessage] = useState("");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [upiId, setUpiId] = useState("");
  const [bank, setBank] = useState("");
  const [wallet, setWallet] = useState("");

  const isCustom = state?.orderType === "custom";

  /* ⭐⭐ CART SUPPORT ADDED HERE ⭐⭐ */
  const cartItems = state?.cartItems || [];
  const isCartOrder = state?.orderType === "cart";

  const validateLocation = () => {
    if (!location.trim()) {
      setError("Please enter your delivery location.");
      return false;
    }
    if (location.trim().length < 3) {
      setError("Enter a complete address (e.g., Vijay Nagar).");
      return false;
    }
    setError("");
    return true;
  };

  const validateCard = () => {
    const { number, name, expiry, cvv } = card;
    if (!/^\d{12,19}$/.test(number.replace(/\s/g, ""))) {
      setGatewayMessage("Enter valid card number (12–19 digits).");
      return false;
    }
    if (!name.trim()) {
      setGatewayMessage("Enter cardholder name.");
      return false;
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      setGatewayMessage("Expiry must be MM/YY.");
      return false;
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      setGatewayMessage("Enter valid CVV.");
      return false;
    }
    return true;
  };

  const validateUpi = () => {
    if (!/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upiId)) {
      setGatewayMessage("Enter a valid UPI ID (like name@bank).");
      return false;
    }
    return true;
  };

  const simulatePayment = async () => {
    setGatewayMessage("Processing payment...");
    await new Promise((r) => setTimeout(r, 1200));
    return Math.random() > 0.05;
  };

  /* ⭐ REAL ORDER SUBMISSION (SINGLE ITEM / CUSTOM) ⭐ */
  const placeOrderOnServer = async (paymentMethodLabel, paymentRef, finalAddress) => {
    const baseData = {
      userId: localStorage.getItem("_id"),
      name: localStorage.getItem("name"),
      mobile: localStorage.getItem("mobile"),
      address: localStorage.getItem("address"),
      location: finalAddress,
      paymentMode: paymentMethodLabel,
      paymentRef: paymentRef || null,
      total: state?.total,
    };

    const orderData = isCustom
      ? {
          ...baseData,
          orderType: "custom",
          cake: state?.customDetails?.cakeName || "Custom Cake",
          quantity: state?.customDetails?.qty || 1,
          customDetails: state?.customDetails,
        }
      : {
          ...baseData,
          orderType: "normal",
          cake: state?.cake,
          weight: state?.weight,
          quantity: state?.quantity,
          message: state?.message,
        };

    await axios.post(orderapi + "place", orderData);
  };

  /* ⭐ MULTIPLE CART ITEMS - SAVE EACH ORDER ⭐ */
const placeCartOrders = async (finalAddress) => {
  const userId = localStorage.getItem("_id") || "";
  const name = localStorage.getItem("name") || "";
  const mobile = localStorage.getItem("mobile") || "";

  for (const item of cartItems) {
    await axios.post(orderapi + "place", {
      userId,
      name,
      mobile,  // ⭐ phone number fixed
      cake: item.name,
      weight: item.weight,
      quantity: item.quantity,
      message: item.message,
      total: item.price,
      orderType: "cart",
      paymentMode: "Gateway",
      location: finalAddress
    });
  }
};


  /* ------------------------ PAY NOW ------------------------- */
  const handlePayNow = async () => {
    setGatewayMessage("");

    if (!validateLocation()) return;

    const finalAddress = normalizeAddress(location);
    if (!finalAddress) {
      setError("Please enter a valid Indore location (e.g., Vijay Nagar)");
      return;
    }

    if (method === "card" && !validateCard()) return;
    if (method === "upi" && !validateUpi()) return;

    setLoading(true);

    try {
      const success = await simulatePayment();
      if (!success) {
        setGatewayMessage("Payment failed. Try another method.");
        setLoading(false);
        return;
      }

      const fakePaymentRef = `FAKEPAY-${Date.now()}`;

      if (isCartOrder) {
        await placeCartOrders(finalAddress);
        localStorage.removeItem("cartItems");
        localStorage.setItem("cartCount", "0");
      } else {
        await placeOrderOnServer("Gateway-" + method.toUpperCase(), fakePaymentRef, finalAddress);
      }

      setGatewayMessage("✅ Payment successful! Order placed.");

      setTimeout(() => {
        navigate(isCartOrder ? "/orders" : isCustom ? "/my-custom-orders" : "/orders");
      }, 1000);

    } catch (err) {
      console.error(err);
      setGatewayMessage("Server error while placing order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------ UI START ------------------------- */
  return (
    <div className="pg-container">
      <div className="pg-card shadow-sm">
        <h2 className="pg-title">Secure Payment</h2>

        <div className="pg-row">
          {/* LEFT SIDE */}
          <div className="pg-left">
            <label className="pg-label">Delivery Location</label>
            <input
              className="pg-input"
              placeholder="Eg: Vijay Nagar, Indore"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            {error && <div className="pg-error">{error}</div>}

            {/* AMOUNT */}
            <div className="pg-amount">
              <div>
                <small>Order Total</small>
                <div className="pg-amount-value">₹{state?.total ?? 0}</div>
              </div>
              <div className="pg-flag">Secure</div>
            </div>

            {/* PAYMENT METHODS */}
            <label className="pg-label mt-3">Choose Payment Method</label>
            <div className="pg-methods">
              {["card", "upi", "netbanking", "wallet"].map((m) => (
                <button
                  key={m}
                  className={`pg-method ${method === m ? "active" : ""}`}
                  onClick={() => setMethod(m)}
                >
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>

            {/* PAYMENT PANELS */}
            <div className="pg-method-panel">
              {method === "card" && (
                <>
                  <label className="pg-label">Card Number</label>
                  <input
                    className="pg-input"
                    placeholder="1234 5678 9012 3456"
                    value={card.number}
                    onChange={(e) => setCard({ ...card, number: e.target.value })}
                  />

                  <div className="pg-inline">
                    <div style={{ flex: 2 }}>
                      <label className="pg-label">Name on Card</label>
                      <input
                        className="pg-input"
                        placeholder="Full Name"
                        value={card.name}
                        onChange={(e) => setCard({ ...card, name: e.target.value })}
                      />
                    </div>

                    <div style={{ flex: 1, marginLeft: 10 }}>
                      <label className="pg-label">Expiry (MM/YY)</label>
                      <input
                        className="pg-input"
                        placeholder="MM/YY"
                        value={card.expiry}
                        onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                      />
                    </div>

                    <div style={{ flex: 1, marginLeft: 10 }}>
                      <label className="pg-label">CVV</label>
                      <input
                        className="pg-input"
                        placeholder="CVV"
                        value={card.cvv}
                        onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              )}

              {method === "upi" && (
                <>
                  <label className="pg-label">Enter UPI ID</label>
                  <input
                    className="pg-input"
                    placeholder="yourname@bank"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                  <div className="pg-note">Approve payment in your UPI app.</div>
                </>
              )}

              {method === "netbanking" && (
                <>
                  <label className="pg-label">Select Bank</label>
                  <select className="pg-input" value={bank} onChange={(e) => setBank(e.target.value)}>
                    <option value="">-- choose bank --</option>
                    <option value="HDFC">HDFC Bank</option>
                    <option value="SBI">State Bank of India</option>
                    <option value="ICICI">ICICI Bank</option>
                    <option value="AXIS">Axis Bank</option>
                  </select>
                  <div className="pg-note">Redirecting to bank... (simulated)</div>
                </>
              )}

              {method === "wallet" && (
                <>
                  <label className="pg-label">Select Wallet</label>
                  <select className="pg-input" value={wallet} onChange={(e) => setWallet(e.target.value)}>
                    <option value="">-- choose wallet --</option>
                    <option value="Paytm">Paytm</option>
                    <option value="PhonePe">PhonePe</option>
                    <option value="GooglePay">Google Pay</option>
                  </select>
                  <div className="pg-note">Fast & secure.</div>
                </>
              )}
            </div>

            {gatewayMessage && <div className="pg-info">{gatewayMessage}</div>}

            <div className="pg-actions">
              <button className="pg-pay-btn" onClick={handlePayNow} disabled={loading}>
                {loading ? "Processing..." : `Pay ₹${state?.total ?? 0}`}
              </button>
            </div>
          </div>

          {/* RIGHT SIDE SUMMARY */}
          <div className="pg-right">
            <div className="pg-summary">
              <h4>Order Summary</h4>

              {/* ⭐⭐ CART MULTIPLE ITEMS SHOW HERE ⭐⭐ */}
              {isCartOrder && (
              <>
                {cartItems.map((item, idx) => (
                  <div className="pg-summary-row" key={idx}>
                    <div>{item.name} ({item.weight})</div>
                    <div>₹{item.price}</div>
                  </div>
                ))}

                <div className="pg-divider" />

                <div className="pg-summary-row total">
                  <div>Total</div>
                  <div>₹{state?.total}</div>
                </div>

                <div className="pg-trust">DemoPay • 100% Secure Checkout</div>
              </>
              )}

              {/* ⭐⭐ SINGLE OR CUSTOM ORDER (Original Code Untouched) ⭐⭐ */}
              {!isCartOrder && isCustom ? (
                <>
                  <div className="pg-summary-row"><div>Item</div><div>{state?.customDetails?.cakeName || "Custom Cake"}</div></div>
                  <div className="pg-summary-row"><div>Weight</div><div>{state?.customDetails?.weight || "-"}</div></div>
                  <div className="pg-summary-row"><div>Qty</div><div>{state?.customDetails?.qty || 1}</div></div>
                  <div className="pg-summary-row"><div>Flavor</div><div>{state?.customDetails?.flavor || "-"}</div></div>
                  <div className="pg-summary-row"><div>Shape</div><div>{state?.customDetails?.shape || "-"}</div></div>
                  <div className="pg-summary-row"><div>Message</div><div>{state?.customDetails?.message || "-"}</div></div>
                </>
              ) : !isCartOrder && (
                <>
                  <div className="pg-summary-row"><div>Item</div><div>{state?.cake}</div></div>
                  <div className="pg-summary-row"><div>Weight</div><div>{state?.weight}</div></div>
                  <div className="pg-summary-row"><div>Qty</div><div>{state?.quantity}</div></div>
                  <div className="pg-summary-row"><div>Message</div><div>{state?.message || "-"}</div></div>
                </>
              )}

              {!isCartOrder && (
              <>
                <div className="pg-divider" />

                <div className="pg-summary-row total">
                  <div>Total</div>
                  <div>₹{state?.total ?? 0}</div>
                </div>

                <div className="pg-trust">DemoPay • 100% Secure Checkout</div>
              </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PaymentGateway;

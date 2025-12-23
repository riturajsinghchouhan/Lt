import './open.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Open() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState('500gms');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  // ⭐ Load user
  useEffect(() => {
    const storedUser =
      localStorage.getItem("user-info") || localStorage.getItem("name");

    try {
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed && (parsed._id || parsed.name)) {
          setUser(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to parse user-info from localStorage", e);
    }
  }, []);

  if (!state) return <p className="text-center">No cake details found.</p>;

  // ⭐ Price calculation logic
  const getPriceByWeight = () => {
    const basePrice = parseFloat(state.price) || 0;
    let multiplier = 1;
    let discount = 0;

    if (selectedWeight === '1kg') {
      multiplier = 2;
      discount = 0.10;
    } else if (selectedWeight === '1.5kg') {
      multiplier = 3;
      discount = 0.20;
    }

    const calculatedPrice = basePrice * multiplier;
    const discounted = calculatedPrice - (calculatedPrice * discount);
    return { price: calculatedPrice, discountedPrice: discounted };
  };

  const { price, discountedPrice } = getPriceByWeight();
  const discountPercentage = ((100 * (price - discountedPrice)) / price).toFixed(0);


  // ⭐ Handle Quantity
  const handleQuantityChange = (type) => {
    if (type === 'dec' && quantity > 1) setQuantity(quantity - 1);
    if (type === 'inc') setQuantity(quantity + 1);
  };

  // ⭐ ADD TO CART LOGIC (MAIN CHANGE)
  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    // 🛒 Cart item object
    const cartItem = {
      id: Date.now(),
      name: state.subcatnm,
      image: state.subcaticonnm,
      weight: selectedWeight,
      quantity,
      message,
      price: discountedPrice * quantity
    };

    // 🛒 Save to cart in localStorage
    const existingCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    existingCart.push(cartItem);
    localStorage.setItem("cartItems", JSON.stringify(existingCart));

    // 🛒 Update cart count
    const count = existingCart.length;
    localStorage.setItem("cartCount", count.toString());

    // 🔁 Redirect to Cart Page
    navigate('/cart');
  };

  return (
    <div className="container py-5">
      <div className="row align-items-start">
        <div className="col-md-6 text-center">
          <img
            src={`http://localhost:3001/uploads/subcaticons/${state.subcaticonnm}`}
            alt={state.subcatnm}
            className="img-fluid rounded"
          />
        </div>

        <div className="col-md-6">
          <h3 className="fw-bold">{state.subcatnm}</h3>
          <h4 className="text-danger fw-semibold">
            ₹{(discountedPrice * quantity).toFixed(0)}
            <del className="text-muted fs-6 ms-2">
              ₹{(price * quantity).toFixed(0)}
            </del>
            <span className="badge bg-success ms-2">{discountPercentage}% OFF</span>
          </h4>

          <div className="row my-4">
            <div className="col">
              <label className="form-label">Weight</label>
              <select
                className="form-select"
                value={selectedWeight}
                onChange={(e) => setSelectedWeight(e.target.value)}
              >
                <option value="500gms">500gms</option>
                <option value="1kg">1kg</option>
                <option value="1.5kg">1.5kg</option>
              </select>
            </div>

            <div className="col">
              <label className="form-label">Message on Cake</label>
              <input
                type="text"
                maxLength={30}
                className="form-control"
                placeholder="Write your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>

          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="btn-group border rounded" role="group">
              <button className="btn btn-outline-secondary" onClick={() => handleQuantityChange('dec')}>–</button>
              <span className="px-3 py-2">{quantity}</span>
              <button className="btn btn-outline-secondary" onClick={() => handleQuantityChange('inc')}>+</button>
            </div>

            {/* ⭐ ADD TO CART BUTTON FIXED */}
            <button className="btn btn-dark px-4" onClick={handleAddToCart}>
              ADD TO CART
            </button>
          </div>

          <div className="accordion mt-4" id="cakeDetails">
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingDetails"></h2>
              <div
                id="collapseDetails"
                className="accordion-collapse collapse show"
                aria-labelledby="headingDetails"
                data-bs-parent="#cakeDetails"
              >
                <div className="accordion-body">
                  <p><strong>Cake Flavour:</strong> {state.subcatnm}</p>
                  <p><strong>Weight:</strong> {selectedWeight}</p>
                  <p><strong>Net Quantity:</strong> {quantity}</p>
                  <p><strong>Total Price:</strong> ₹{(discountedPrice * quantity).toFixed(0)}</p>
                  <p><strong>Message:</strong> {message || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Open;

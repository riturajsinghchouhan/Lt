// src/components/CategoryPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './Recake.css';

function CategoryPage() {
  const { catnm } = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/subcategory/fetch?catnm=${catnm}`)
      .then(res => setSubcategories(res.data))
      .catch(err => console.error("Fetch error:", err));
  }, [catnm]);

  // ⭐ Generate rating stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} style={{ color: "#FFD700", fontSize: "18px" }}>★</span>);
    }

    if (halfStar) {
      stars.push(<span key="half" style={{ color: "#FFD700", fontSize: "18px" }}>☆</span>);
    }

    return stars;
  };

  // ⭐ ADD TO CART FUNCTION
  const addToCart = (sub) => {
    const item = {
      id: Date.now(),
      name: sub.subcatnm,
      image: sub.subcaticonnm,
      weight: "500gms",
      quantity: 1,
      message: "",
      price: parseFloat(sub.price) || 0,
      rating: sub.rating || 4.5 // ⭐ includes rating
    };

    const cart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    cart.push(item);

    localStorage.setItem("cartItems", JSON.stringify(cart));
    localStorage.setItem("cartCount", cart.length.toString());

    alert("Item added to cart!");
  };

  const handleClick = (subcat) => {
    navigate('/product', { state: subcat });
  };

  return (
    <section id="cake-menu">
      <div className="menu-container">
        <h2 className="menu-heading">{catnm} Cake Subcategories</h2>

        <div className="cake-grid">
          {subcategories.length > 0 ? (
            subcategories.map((sub, index) => (
              <div className="cake-card" key={index}>
                
                {/* Image moves to product */}
                <div onClick={() => handleClick(sub)} style={{ cursor: 'pointer' }}>
                  <img
                    src={`http://localhost:3001/uploads/subcaticons/${sub.subcaticonnm}`}
                    alt={sub.subcatnm}
                  />
                </div>

                <h3>{sub.subcatnm}</h3>

                {/* ⭐ Rating Here */}
                <div className="rating-stars">
                  {renderStars(sub.rating || 4.5)}
                  <span className="rating-text">({sub.rating || 4.5})</span>
                </div>

                <p className="price-text">₹{sub.price}/-</p>

                {/* Add to cart */}
                <button
                  className="btn btn-dark w-100 mt-2"
                  onClick={() => addToCart(sub)}
                >
                  🛒 Add to Cart
                </button>

                {/* View product */}
                <button
                  className="btn btn-outline-primary w-100 mt-2"
                  onClick={() => handleClick(sub)}
                >
                  View Details
                </button>

              </div>
            ))
          ) : (
            <p>No subcategories found.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default CategoryPage;

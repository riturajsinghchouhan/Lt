import "./Footer.css";
import { useEffect, useState } from "react";

function Footer() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedInfo =
      localStorage.getItem("user-info") || localStorage.getItem("name");
    try {
      if (storedInfo) {
        const parsed = JSON.parse(storedInfo);
        if (parsed?.name) {
          setUserName(parsed.name);
        } else if (typeof parsed === "string") {
          setUserName(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to parse user info", e);
    }
  }, []);

  return (
    <>
      <footer className="footer-wrapper">
        {/* QUICK LINKS */}
        <div className="footer-top">
          <h2 className="footer-title">QUICK LINKS</h2>
        </div>

        {/* Newsletter Section */}
        <div className="newsletter-section">
          <h3>SUBSCRIBE TO OUR NEWSLETTER</h3>

          <div className="newsletter-input-box">
            <input type="email" placeholder="Enter Email Address" />
            <button>→</button>
          </div>
        </div>

        {/* Footer Main Content */}
        <div className="footer-main">
          {/* Left Branding Area */}
          <div className="footer-brand">
            <h1 className="brand-logo">Bake Me Blush</h1>
            <p>© {new Date().getFullYear()}</p>

            {userName && (
              <p className="welcome-msg">
                Welcome, <strong>{userName}</strong> ❤️
              </p>
            )}

            {/* Social Icons */}
            <div className="footer-social">
              <a><i className="fab fa-facebook-f"></i></a>
              <a><i className="fab fa-instagram"></i></a>
              <a><i className="fab fa-twitter"></i></a>
              <a><i className="fab fa-linkedin-in"></i></a>
              <a><i className="fab fa-youtube"></i></a>
            </div>
          </div>

          {/* Know Us */}
          <div className="footer-links">
            <h4>KNOW US</h4>
            <a href="/about">About Us</a>
            <a href="/contact">Contact Us</a>
            <a href="/">Locate Us</a>
            <a href="/">Blog</a>
            <a href="/">Media</a>
            <a href="/">Careers</a>
          </div>

          {/* Need Help */}
          <div className="footer-links">
            <h4>NEED HELP</h4>
            <a href="/">FAQ</a>
            <a href="/">Cancellation & Refund</a>
            <a href="/">Privacy Policy</a>
            <a href="/">Terms & Conditions</a>
            <a href="/">Customer Grievance</a>
            <a href="/">Sitemap</a>
          </div>

          {/* More Info */}
          <div className="footer-links">
            <h4>MORE INFO</h4>
            <a href="/">Corporate Cakes</a>
            <a href="/">Coupons & Offers</a>
            <a href="/">Download App</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;

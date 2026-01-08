import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { userapi } from "../../Api_url";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      setMessage("Email and password are required.");
      return;
    }

    axios
      .post(`${userapi}login`, { email, password })
      .then((res) => {
        // ✅ BACKEND RESPONSE
        const { token, user } = res.data;

        if (!token || !user) {
          setMessage("Invalid server response");
          return;
        }

        // ✅ Store token
        localStorage.setItem("token", token);

        // ✅ Store user details
        localStorage.setItem("name", user.name);
        localStorage.setItem("email", user.email);
        localStorage.setItem("mobile", user.mobile);
        localStorage.setItem("address", user.address);
        localStorage.setItem("_id", user._id);
        localStorage.setItem("status", user.status);
        localStorage.setItem("role", user.role);
        localStorage.setItem("info", user.info);

        // ✅ Single source of truth
        localStorage.setItem("user-info", JSON.stringify(user));

        // ✅ Role-based redirect
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      })
      .catch((err) => {
        console.error("Login error:", err.response?.data || err);
        setMessage("Login failed. Please try again.");
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="form-box shadow p-4 rounded bg-white">
        <h2 className="text-center mb-4">Login</h2>

        {message && <div className="text-danger mb-2">{message}</div>}

        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="love btn-primary w-100" onClick={handleLogin}>
          Login
        </button>

        <p className="mt-3 text-center">
          Don&apos;t have an account? <Link to="/register">register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

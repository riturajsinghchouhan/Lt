import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { userapi } from '../../Api_url';
import { Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      setMessage('Email and password are required.');
      return;
    }

  axios.post(`${userapi}login`, { email, password })
  .then((res) => {
    const userDetail = res.data.userList;

    // ✅ Store token and user details
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('name', userDetail.name);
    localStorage.setItem('mobile', userDetail.mobile);
    localStorage.setItem('address', userDetail.address);
    localStorage.setItem('_id', userDetail._id);
    localStorage.setItem('status', userDetail.status);
    localStorage.setItem('password', userDetail.password);
    localStorage.setItem('role', userDetail.role);
    localStorage.setItem('info', userDetail.info);

    // ✅ This line is IMPORTANT for Open.jsx to work
    localStorage.setItem('user-info', JSON.stringify(userDetail));

    // ✅ Role-based redirect
    if (userDetail.role === 'admin') {
      window.location.href = '/admin';
    } else {
      window.location.href = '/';
    }
  })
  .catch((err) => {
    console.log(err);
    setMessage('Login failed. Please try again.');
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
            onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="love btn-primary w-100" onClick={handleLogin}>Login</button>
        <p className="mt-3 text-center">
          Don't have an account? <Link to='/register'>register</Link>
          
        </p>
      </div>
    </div>
  );
}

export default Login;

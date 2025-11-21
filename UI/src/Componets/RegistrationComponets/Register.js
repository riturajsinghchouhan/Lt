// src/pages/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { userapi } from '../../Api_url';
import { Link } from 'react-router-dom';
import './Register.css'

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    address:''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    const { name, email, password, mobile,address } = form;
    if (!name || !email || !password || !mobile || !address) {
      setMessage('All fields are required.');
      return;
    }

    axios.post(`${userapi}register`, form)
      .then(() => {
        setMessage('Registered successfully.');
        navigate('/login');
      })
      .catch(() => setMessage('Registration failed.'));
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="form-box shadow p-4 rounded bg-white">
        <h2 className="text-center mb-4">Register</h2>
        {message && <div className="text-danger mb-2">{message}</div>}
        <div className="mb-3">
          <label>Name</label>
          <input name="name" className="form-control" onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input name="email" className="form-control" onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input name="password" type="password" className="form-control" onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Mobile</label>
          <input name="mobile" className="form-control" onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Address</label>
          <input name="address" className="form-control" onChange={handleChange} />
        </div>
        <button className="btn btn-success w-100" onClick={handleRegister}>Register</button>
        <p className="mt-3 text-center">
          Already have an account? 
           <Link to='/login'>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

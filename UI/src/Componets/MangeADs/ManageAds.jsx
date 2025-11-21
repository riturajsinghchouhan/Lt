import React, { useState, useEffect } from "react";
import axios from "axios";
import './ManageAds.css';

const ManageAds = () => {
  const [ads, setAds] = useState([]);
  const [form, setForm] = useState({
    title: "",
    type: "",
    description: "",
    link: "",
    image: null
  });

  // Fetch all ads
  const fetchAds = async () => {
    const res = await axios.get("http://localhost:3001/ads/fetch");
    if(res.data.success) setAds(res.data.ads);
  };

  useEffect(() => {
    fetchAds();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") setForm({ ...form, image: files[0] });
    else setForm({ ...form, [name]: value });
  };

  // Add new ad
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach(key => {
      if(form[key]) formData.append(key, form[key]);
    });

    const res = await axios.post("http://localhost:3001/ads/save", formData);
    if(res.data.success) {
      alert("Ad added!");
      setForm({ title: "", type: "", description: "", link: "", image: null });
      fetchAds();
    }
  };

  // Delete ad
  const handleDelete = async (id) => {
    const res = await axios.delete(`http://localhost:3001/ads/${id}`);
    if(res.data.success) fetchAds();
  };

  return (
    <div className="manage-ads-container">
      <h2>Manage Ads</h2>

      {/* Add Ad Form */}
      <form onSubmit={handleSubmit}>
        <input 
          name="title" 
          placeholder="Title" 
          value={form.title} 
          onChange={handleChange} 
          required
        />
        <input 
          name="type" 
          placeholder="Type (top-seller, budget-buy, daily-special)" 
          value={form.type} 
          onChange={handleChange} 
          required
        />
        <input 
          name="description" 
          placeholder="Description" 
          value={form.description} 
          onChange={handleChange}
        />
        <input 
          name="link" 
          placeholder="Link" 
          value={form.link} 
          onChange={handleChange}
        />
        <input 
          type="file" 
          name="image" 
          onChange={handleChange}
        />
        <button type="submit">Add Ad</button>
      </form>

      {/* Existing Ads List */}
      <h3>Existing Ads</h3>
      <div className="ads-list">
        {ads.map(ad => (
          <div className="ad-card" key={ad._id}>
            {ad.image && <img src={`http://localhost:3001/${ad.image}`} alt={ad.title} />}
            <h4>{ad.title}</h4>
            <p>{ad.type}</p>
            {ad.description && <p>{ad.description}</p>}
            <button onClick={() => handleDelete(ad._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageAds;

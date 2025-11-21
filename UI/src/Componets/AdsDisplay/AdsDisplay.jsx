import React, { useState, useEffect } from "react";
import axios from "axios";
import './AdsDisplay.css';

const AdsDisplay = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    const fetchAds = async () => {
      const res = await axios.get("http://localhost:3001/ads/fetch");
      if(res.data.success) {
        // Filter only active ads
        const activeAds = res.data.ads.filter(ad => ad.status);
        setAds(activeAds);
      }
    };
    fetchAds();
  }, []);

  return (
    <div className="user-ads-container">
      {ads.map(ad => (
        <div className="user-ad-card" key={ad._id}>
          {ad.image && <img src={`http://localhost:3001/${ad.image}`} alt={ad.title} />}
          <h4>{ad.title}</h4>
          <p>{ad.description}</p>
        </div>
      ))}
    </div>
  );
};

export default AdsDisplay;

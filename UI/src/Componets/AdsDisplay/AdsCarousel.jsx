import React, { useState, useEffect } from "react";
import axios from "axios";
import './AdsCarousel.css';

const AdsCarousel = () => {
  const [ads, setAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchAds = async () => {
      const res = await axios.get("http://localhost:3001/ads/fetch");
      if(res.data.success) {
        const activeAds = res.data.ads.filter(ad => ad.status);
        setAds(activeAds);
      }
    };
    fetchAds();
  }, []);

  // Auto move every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % ads.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [ads]);

  if(ads.length === 0) return null;

  const ad = ads[currentIndex];

  return (
    <div className="ads-carousel-container">
      {ad.image && <img src={`http://localhost:3001/${ad.image}`} alt={ad.title} />}
      <div className="ads-carousel-info">
        <h3>{ad.title}</h3>
        <p>{ad.description}</p>
      </div>
    </div>
  );
};

export default AdsCarousel;

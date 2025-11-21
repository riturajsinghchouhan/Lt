import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CustomCake.css";

function CustomCake() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    cakeName: "",
    base: "",
    shape: "",
    weight: "",
    flavor: "",
    toppings: [],
    message: "",
    image: null,
    deliveryDate: "",
    qty: 1,
  });

  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [userInfo, setUserInfo] = useState({
    userId: 0,
    name: "",
    mobile: "",
    address: "",
    info: "",
  });

  useEffect(() => {
    const userId = Number(localStorage.getItem("_id")) || 0;
    const info = localStorage.getItem("info") || "not found";
    const name = localStorage.getItem("name") || "Custom Cake";
    const mobile = localStorage.getItem("mobile") || "0000000000";
    const address = localStorage.getItem("address") || "Not provided";
    setUserInfo({ userId, name, mobile, address, info });
  }, []);

  const prices = {
    weight: { "0.5": 300, "1": 550, "2": 1000 },
    toppings: { nuts: 50, gems: 30, fruits: 70, chocochips: 40 },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleToppings = (e) => {
    const { value, checked } = e.target;
    let updated = [...form.toppings];
    if (checked) updated.push(value);
    else updated = updated.filter((t) => t !== value);
    setForm({ ...form, toppings: updated });
  };

  const handleImage = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const calculateTotal = () => {
    let price = 0;
    if (form.weight) price += prices.weight[form.weight] || 0;
    form.toppings.forEach((t) => {
      price += prices.toppings[t] || 0;
    });
    price *= form.qty; // multiply by quantity
    setTotal(price);
  };

  const placeCustomOrder = async () => {
    if (!form.base || !form.shape || !form.weight || !form.flavor || !form.deliveryDate || !form.cakeName) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("userId", userInfo.userId);
      data.append("name", userInfo.name);
      data.append("mobile", userInfo.mobile);
      data.append("address", userInfo.address);
      data.append("info", userInfo.info);
      data.append("cakeType", "Custom Cake");
      data.append("cakeName", form.cakeName);
      data.append("base", form.base);
      data.append("shape", form.shape);
      data.append("weight", form.weight);
      data.append("flavor", form.flavor);
      data.append("qty", Number(form.qty));
      data.append("message", form.message);
      data.append("total", total);
      data.append("deliveryDate", form.deliveryDate);
      data.append("toppings", JSON.stringify(form.toppings));
      if (form.image) data.append("image", form.image);

      const res = await axios.post(
        "http://localhost:3001/customcake/place-custom",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setLoading(false);

      if (res.data.success) {
  alert("Order placed successfully!");

  navigate("/review", {
    state: {
      isCustom: true,
      name: form.cakeName, // ✅ map cakeName → name
      base: form.base,
      shape: form.shape,
      weight: form.weight,
      flavor: form.flavor,
      qty: form.qty,
      message: form.message,
      toppings: form.toppings,
      total,
      image: form.image, // ✅ preview using URL.createObjectURL
      deliveryDate: form.deliveryDate,
    },
  });
} else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error in placeCustomCake:", error);
      setLoading(false);
      alert("Error placing order. Check console for details.");
    }
  };

  return (
    <div className="custom-cake-container">
      <h2 className="title">🎂 Customize Your Cake</h2>

      <div className="form-section">
        <label>Cake Name:</label>
        <input type="text" name="cakeName" placeholder="Enter Cake Name" onChange={handleChange} />

        <label>Choose Base:</label>
        <select name="base" onChange={handleChange}>
          <option value="">Select</option>
          <option value="Vanilla">Vanilla</option>
          <option value="Chocolate">Chocolate</option>
          <option value="Red Velvet">Red Velvet</option>
        </select>

        <label>Cake Shape:</label>
        <select name="shape" onChange={handleChange}>
          <option value="">Select</option>
          <option value="Round">Round</option>
          <option value="Square">Square</option>
          <option value="Heart">Heart</option>
        </select>

        <label>Weight (kg):</label>
        <select name="weight" onChange={handleChange}>
          <option value="">Select</option>
          <option value="0.5">0.5 kg</option>
          <option value="1">1 kg</option>
          <option value="2">2 kg</option>
        </select>

        <label>Flavor:</label>
        <input type="text" name="flavor" placeholder="e.g. Butterscotch" onChange={handleChange} />

        <label>Quantity:</label>
        <input type="number" name="qty" min="1" value={form.qty} onChange={handleChange} />

        <label>Toppings:</label>
        <div>
          {Object.keys(prices.toppings).map((t) => (
            <div key={t}>
              <input type="checkbox" value={t} onChange={handleToppings} /> {t} (+₹{prices.toppings[t]})
            </div>
          ))}
        </div>

        <label>Message on Cake:</label>
        <input type="text" name="message" placeholder="Happy Birthday..." onChange={handleChange} />

        <label>Delivery Date:</label>
        <input type="date" name="deliveryDate" onChange={handleChange} />

        <label>Upload Design (Optional):</label>
        <input type="file" accept="image/*" onChange={handleImage} />

        <button className="btn btn-primary mt-3" onClick={calculateTotal}>
          Calculate Price
        </button>

        {total > 0 && <h4 className="mt-2">Total: ₹{total}</h4>}

        <button className="btn btn-success mt-3" onClick={placeCustomOrder} disabled={loading}>
          {loading ? "Placing Order..." : "Place Custom Order"}
        </button>
      </div>
    </div>
  );
}

export default CustomCake;

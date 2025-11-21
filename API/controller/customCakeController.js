import fs from "fs";
import path from "path";
import CustomCake from "../model/CustomCake.model.js";

// Place Custom Cake Order
export const placeCustomCake = async (req, res) => {
  try {
        console.log("✅ req.user:", req.user);
    // 🧑 Get user info from auth middleware (logged-in user)
    const { _id: userId, name, email, phone, address: userAddress } = req.user;
    
console.log("👤 User Details:", { userId, name, email, phone, userAddress });
    // Get other cake order details from request body
    const {
      cakeType,
      cakeName,
      qty,
      base,
      deliveryDate,
      shape,
      weight,
      flavor,
      toppings,
      message,
      paymentMode,
      address: deliveryAddress, // optional separate address
    } = req.body;

    // 🧮 Calculate base price dynamically
    let basePrice = 400; // default
    if (flavor === "Chocolate") basePrice = 500;
    if (flavor === "Butterscotch") basePrice = 550;
    if (flavor === "Red Velvet") basePrice = 700;

    const numericWeight = parseFloat(weight) || 1;
    const numericQty = Number(qty) || 1;
    const total = basePrice * numericWeight * numericQty;

    // 🖼️ Handle image upload
    let imagePath = null;
    if (req.files && req.files.image) {
      const uploadDir = path.join("uploads/customcakes");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      imagePath = `${uploadDir}/${Date.now()}_${req.files.image.name}`;
      await req.files.image.mv(imagePath);
    }

    // 🛠 Save order
    const order = new CustomCake({
      userId,
      name,                  // from logged-in user
      mobile: phone,         // from logged-in user
      address: deliveryAddress || userAddress, // use delivery address if provided
      cakeType,
      cakeName,
      qty: numericQty,
      base,
      shape,
      deliveryDate,
      weight: numericWeight,
      flavor,
      toppings: JSON.parse(toppings || "[]"),
      message,
      total,
      paymentMode: paymentMode || "Pending",
      image: imagePath,
      isCustom: true,
      status: "Pending",
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "Custom Cake Order Placed",
      order,
    });
  } catch (err) {
    console.error("❌ Error in placeCustomCake:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Admin: get all custom orders
export const getAllCustomOrders = async (req, res) => {
  try {
    const orders = await CustomCake.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


export const getUserCustomOrders = async (req, res) => {
  try {
    const numericUserId = Number(req.params.userId);
    const orders = await CustomCake.find({ userId: numericUserId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

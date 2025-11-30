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
      const uploadDir = process.env.CUSTOM_CAKE_PATH;
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
    // ------------------------------
    // 1. Get Query Params (Filters)
    // ------------------------------
    const {
      page = 1,
      limit = 10,
      status,
      userId,
      flavor,
      shape,
      search,
      startDate,
      endDate
    } = req.query;

    const skip = (page - 1) * limit;

    // ------------------------------
    // 2. Build Dynamic Filters
    // ------------------------------
    let filter = {};

    if (status) filter.status = status; // Pending, Delivered, Cancelled
    if (userId) filter.userId = Number(userId);
    if (flavor) filter.flavor = flavor;
    if (shape) filter.shape = shape;

    // Search by cake name or message
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { cakeName: regex },
        { message: regex },
        { flavor: regex },
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};

      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const date = new Date(endDate);
        date.setHours(23, 59, 59);
        filter.createdAt.$lte = date;
      }
    }

    // ------------------------------
    // 3. Fetch Orders with pagination
    // ------------------------------
    const orders = await CustomCake.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalOrders = await CustomCake.countDocuments(filter);

    // ------------------------------
    // 4. Response
    // ------------------------------
    res.json({
      success: true,
      orders,
      totalOrders,
      page: Number(page),
      limit: Number(limit),
      hasMore: skip + Number(limit) < totalOrders,
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


export const getUserCustomOrders = async (req, res) => {
  try {
    const numericUserId = Number(req.params.userId);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    // Fetch limited orders
    const orders = await CustomCake.find({ userId: numericUserId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Count total orders
    const totalOrders = await CustomCake.countDocuments({ userId: numericUserId });

    res.json({
      success: true,
      orders,
      page,
      limit,
      totalOrders,
      hasMore: skip + limit < totalOrders
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ⭐ UPDATE CUSTOM ORDER STATUS (Pending → Delivered or Delivered → Pending)
export const updateCustomOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const updated = await CustomCake.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Status updated successfully",
      order: updated,
    });

  } catch (err) {
    console.error("❌ Error updating status:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

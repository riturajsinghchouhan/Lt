import express from 'express';
import OrderModel from '../model/order_model.js';
import Notification from '../model/notification_model.js';  // ✅ single correct import

const router = express.Router();

/* ----------------------------------------------
   PLACE ORDER
---------------------------------------------- */
router.post('/place', async (req, res) => {
  try {
    const order = new OrderModel({
      ...req.body,
      deliveryAddress: req.body.location || req.body.address,
    });

    await order.save();

    // 🔔 Admin Notification — New Order
    await Notification.create({
      type: "new_order",
      message: `New order placed #${order._id}`,
      orderId: order._id,
      userId: order.userId,
    });

    res.send({ success: true, message: 'Order placed!' });

  } catch (err) {
    res.status(500).send({ success: false, message: 'Failed to place order' });
  }
});

/* ----------------------------------------------
   CANCEL ORDER
---------------------------------------------- */
router.post('/cancel', async (req, res) => {
  try {
    const { orderId, userId } = req.body;

    await OrderModel.updateOne(
      { _id: orderId },
      { status: "Cancelled" }
    );

    // 🔔 Admin Notification — User Cancelled Order
  await Notification.create({
  type: "order_cancel",
  message: `Order #${orderId} has been cancelled`,
  orderId,
  userId,
  userName: req.body.userName, // 👈 ADD THIS
});
console.log(userName)
    res.json({ success: true, message: "Order cancelled" });

  } catch (error) {
    res.status(500).send({ success: false, message: "Error cancelling order" });
  }
});

/* ----------------------------------------------
   ADMIN — FETCH ALL ORDERS
---------------------------------------------- */
router.get('/all', async (req, res) => {
  const orders = await OrderModel.find().sort({ createdAt: -1 });
  res.send(orders);
});

/* ----------------------------------------------
   USER ORDERS (WITH PAGINATION)
---------------------------------------------- */
router.get('/orders', async (req, res) => {
  const { userId, page = 1, limit = 10 } = req.query;

  if (!userId) {
    return res.status(400).send({ success: false, message: 'User ID is required' });
  }

  try {
    const skip = (page - 1) * limit;

    const userOrders = await OrderModel.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalOrders = await OrderModel.countDocuments({ userId });

    res.send({
      success: true,
      orders: userOrders,
      page: Number(page),
      limit: Number(limit),
      totalOrders,
      hasMore: skip + Number(limit) < totalOrders
    });

  } catch (err) {
    res.status(500).send({ success: false, message: 'Failed to fetch orders' });
  }
});

/* ----------------------------------------------
   UPDATE ORDER STATUS
---------------------------------------------- */
router.put('/status/:id', async (req, res) => {
  const { status } = req.body;

  await OrderModel.findByIdAndUpdate(req.params.id, { status });

  // 🔔 Notify admin only if delivered
  if (status === "Delivered") {
    await Notification.create({
      type: "order_delivered",
      message: `Order delivered #${req.params.id}`,
      orderId: req.params.id
    });
  }

  res.send({ success: true });
});

/* ----------------------------------------------
   ADMIN — SALES FILTER
---------------------------------------------- */
router.get('/filter', async (req, res) => {
  try {
    const { type, year, month } = req.query;
    const now = new Date();

    let start, end;

    if (type === "today") {
      start = new Date(now.setHours(0, 0, 0, 0));
      end = new Date();
    }

    else if (type === "last_week") {
      start = new Date();
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      end = new Date();
    }

    else if (type === "last_month") {
      const y = now.getFullYear();
      const m = now.getMonth();
      start = new Date(y, m - 1, 1);
      end = new Date(y, m, 0, 23, 59, 59);
    }

    else if (type === "monthly") {
      start = new Date(year, month - 1, 1);
      end = new Date(year, month, 0, 23, 59, 59);
    }

    else if (type === "all") {
      start = new Date(1980);
      end = new Date();
    }

    else {
      return res.status(400).send({ success: false, message: "Invalid filter type" });
    }

    const orders = await OrderModel.find({
      createdAt: { $gte: start, $lte: end }
    }).sort({ createdAt: -1 });

    res.send(orders);

  } catch (err) {
    res.status(500).send({ success: false, message: "Something went wrong" });
  }
});

/* ----------------------------------------------
   STATS API
---------------------------------------------- */
router.get("/stats", async (req, res) => {
  try {
    const orders = await OrderModel.find();

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const pending = orders.filter(o => o.status === "Pending").length;
    const delivered = orders.filter(o => o.status === "Delivered").length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySales = orders
      .filter(o => new Date(o.createdAt) >= today)
      .reduce((sum, o) => sum + o.total, 0);

    res.json({ totalOrders, totalRevenue, pending, delivered, todaySales });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default router;

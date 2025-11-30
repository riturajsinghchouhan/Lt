import express from "express";
import Notification from "../model/notification_model.js";

const router = express.Router();

// Get admin notifications (Only last 24 hours)
router.get("/", async (req, res) => {

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const list = await Notification.find({
    createdAt: { $gte: oneDayAgo }   // Show only last 24 hours
  })
    .sort({ createdAt: -1 })
    .limit(20);

  res.json(list);
});

// Mark single notification as read
router.put("/read/:id", async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ success: true });
});

// Mark all notifications read
router.put("/read-all", async (req, res) => {
  await Notification.updateMany({}, { isRead: true });
  res.json({ success: true });
});

export default router;

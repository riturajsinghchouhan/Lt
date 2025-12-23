import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },       // order_cancel, new_order, etc.
    message: { type: String, required: true },
    orderId: { type: String },
    userId: { type: String },
    userName: { type: String },
    isRead: { type: Boolean, default: false }

  },
  { timestamps: true }
);

export default mongoose.model("Notification", NotificationSchema);

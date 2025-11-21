import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },       // Example: Top Seller
    description: { type: String },
    image: { type: String },                       // Image path
    link: { type: String },                        // Product/Category link
    type: { type: String, required: true },        // "top-seller", "budget-buy", "daily-special"
    status: { type: Boolean, default: true },      // Active/Inactive
  },
  { timestamps: true }
);

export default mongoose.model("Ad", adSchema);

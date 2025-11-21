import mongoose from "mongoose";

const customCakeSchema = new mongoose.Schema(
  {
    userId: { type: Number, required: true },
    name: { type: String, required: true },
    deliveryDate: { type: String, required: true},
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    cakeType: { type: String, default: "Custom Cake" },
    base: { type: String, required: true },
    shape: { type: String, required: true },
    weight: { type: String, required: true },
    flavor: { type: String, required: true },
    qty: { type: Number, required:true },
    cakeName: { type: String,require:true},
    toppings: { type: [String], default: [] },
    message: String,
    image: String,
    total: { type: Number, required: true },
     isCustom: { type: Boolean, default: false }, // ✅ Added this
    paymentMode: { type: String, default: "Pending" },
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

export default mongoose.model("CustomCake", customCakeSchema);

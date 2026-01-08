import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
      required: true,
    },

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      // ❌ minlength/maxlength REMOVED (bcrypt hash ~60 chars)
    },

    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },

    role: {
      type: String,
      default: "user",
    },

    status: {
      type: Number,
      default: 0,
    },

    info: {
      type: String,
    },
  },
  {
    timestamps: true, // ✅ createdAt, updatedAt
  }
);

// ✅ apply unique validator to SCHEMA (not mongoose)
userSchema.plugin(mongooseUniqueValidator, {
  message: "{PATH} already exists.",
});

const userSchemaModel = mongoose.model("user_collection", userSchema);

export default userSchemaModel;

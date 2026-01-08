import "../model/connection.js";
import url from "url";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import userSchemaModel from "../model/user.model.js";

/* =========================
   REGISTER USER
========================= */
export const save = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔎 Check duplicate email
    const existingUser = await userSchemaModel.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({ msg: "Email already registered" });
    }

    // 🔢 Auto increment numeric _id
    const userList = await userSchemaModel.find().sort({ _id: -1 }).limit(1);
    const _id = userList.length === 0 ? 1 : userList[0]._id + 1;

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userDetail = {
      ...req.body,
      email: email.toLowerCase(),
      password: hashedPassword,
      _id,
      role: "user",
      status: 0,
      info: new Date().toISOString(),
    };

    await userSchemaModel.create(userDetail);

    res.status(201).json({
      success: true,
      msg: "User registered successfully",
    });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({
      success: false,
      msg: "Registration failed",
      error: err.message,
    });
  }
};

/* =========================
   FETCH USERS
========================= */
export const fetch = async (req, res) => {
  try {
    const condition_obj = url.parse(req.url, true).query;
    const users = await userSchemaModel.find(condition_obj);

    if (users.length > 0) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ msg: "User not found" });
    }
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ msg: "Fetch failed", error: err.message });
  }
};

/* =========================
   UPDATE USER
========================= */
export const update = async (req, res) => {
  try {
    const { condition_obj, content_obj } = req.body;

    const user = await userSchemaModel.findOne(condition_obj);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // 🔐 If password updated → hash again
    if (content_obj.password) {
      content_obj.password = await bcrypt.hash(content_obj.password, 10);
    }

    const result = await userSchemaModel.updateOne(
      condition_obj,
      { $set: content_obj }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ msg: "User updated successfully" });
    } else {
      res.status(200).json({ msg: "No changes made" });
    }

  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ msg: "Update failed", error: err.message });
  }
};

/* =========================
   DELETE USER
========================= */
export const deleteUser = async (req, res) => {
  try {
    const { _id } = req.body;

    const user = await userSchemaModel.findById(_id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    await userSchemaModel.deleteOne({ _id });

    res.status(200).json({ msg: "User deleted successfully" });

  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ msg: "Deletion failed", error: err.message });
  }
};

/* =========================
   LOGIN USER
========================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userSchemaModel.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      msg: "Login successful",
      token,
      user,
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ msg: "Login failed", error: err.message });
  }
};

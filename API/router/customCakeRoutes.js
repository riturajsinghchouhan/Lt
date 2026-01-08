import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  placeCustomCake,
  getAllCustomOrders,
  getUserCustomOrders,
   updateCustomOrderStatus
} from "../controller/customCakeController.js";

const router = express.Router();

// Place custom cake order
router.post("/place-custom",authMiddleware, placeCustomCake);

// Admin: fetch all orders
router.get("/all", getAllCustomOrders);

// User-specific orders
router.get('/user/:userId', getUserCustomOrders);

router.put("/status/:id", updateCustomOrderStatus);


export default router;

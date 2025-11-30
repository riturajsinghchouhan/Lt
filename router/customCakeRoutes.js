import express from "express";
import {
  placeCustomCake,
  getAllCustomOrders,
  getUserCustomOrders,
   updateCustomOrderStatus
} from "../controller/customCakeController.js";

const router = express.Router();

// Place custom cake order
router.post("/place-custom", placeCustomCake);

// Admin: fetch all orders
router.get("/all", getAllCustomOrders);

// User-specific orders
router.get('/user/:userId', getUserCustomOrders);

router.put("/status/:id", updateCustomOrderStatus);


export default router;

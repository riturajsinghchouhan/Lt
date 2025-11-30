import express from "express";
import { createAd, getAds, updateAd, deleteAd } from "../controller/ad.controller.js";

const router = express.Router();

router.post("/save", createAd);
router.get("/fetch", getAds);
router.put("/:id", updateAd);
router.delete("/:id", deleteAd);

export default router;

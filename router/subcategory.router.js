import express from 'express';

const router =express.Router();

//to link controller on router file
import * as subcategoryController from '../controller/subcategory.controller.js';

router.post("/save",subcategoryController.save);
router.get("/fetch",subcategoryController.fetch);

export default router;
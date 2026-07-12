import express from "express";
import { addProduct } from "../controller/productController";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";
import { upload } from "../config/cloudinary";

const router = express.Router();

router.post("/product", authMiddleware, adminMiddleware, upload.single("image"), addProduct);

export default router;
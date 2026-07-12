import express from "express";
import { addProduct, getProducts, getProductById } from "../controller/productController";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";
import { upload } from "../config/cloudinary";

const router = express.Router();

router.post("/product", authMiddleware, adminMiddleware, upload.single("image"), addProduct);
router.get("/products", getProducts);
router.get("/product/:id", getProductById);

export default router;
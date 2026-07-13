import express from "express";
import { addProduct, getProducts, getProductById, updateProduct, deleteProduct } from "../controller/productController";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";
import { upload } from "../config/cloudinary";

const router = express.Router();

router.post("/product", authMiddleware, adminMiddleware, upload.single("image"), addProduct);
router.get("/products", getProducts);
router.get("/product/:id", getProductById);
router.patch("/product/:id", authMiddleware, adminMiddleware, upload.single("image"), updateProduct);
router.delete("/product/:id", authMiddleware, adminMiddleware, deleteProduct);

export default router;
import express from "express";
import { addProduct } from "../controller/productController";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";

const router = express.Router();

router.post("/product", authMiddleware, adminMiddleware, addProduct);

export default router;
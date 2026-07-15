import express, { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { addToCart, deleteCartItems, getAllCartItems, updateCartQty } from "../controller/cartController";

const router = express.Router();

router.post("/cart", authMiddleware, addToCart);
router.get("/cartItems", authMiddleware, getAllCartItems);
router.patch("/cart/:id", authMiddleware, updateCartQty);
router.delete("/cart/:id", authMiddleware, deleteCartItems);

export default router;
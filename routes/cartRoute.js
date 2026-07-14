import express, { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { addToCart } from "../controller/cartController";

const router = express.Router();

router.post("/cart", authMiddleware, addToCart);

export default router
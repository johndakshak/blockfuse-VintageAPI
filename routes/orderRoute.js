import express, { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getAllOrdersByAdmin, getOrderByUserId } from "../controller/orderController";
import { adminMiddleware } from "../middleware/adminMiddleware";

const router = express.Router();

router.get("/order", authMiddleware, getOrderByUserId);
router.get("/orders", authMiddleware, adminMiddleware, getAllOrdersByAdmin);

export default router;
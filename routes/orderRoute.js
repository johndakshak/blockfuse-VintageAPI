import express, { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getAllOrdersByAdmin, getOrderByUserId, updateOrderStatus } from "../controller/orderController";
import { adminMiddleware } from "../middleware/adminMiddleware";

const router = express.Router();

router.get("/order", authMiddleware, getOrderByUserId);
router.get("/orders", authMiddleware, adminMiddleware, getAllOrdersByAdmin);
router.patch("/order/status/:id", authMiddleware, adminMiddleware, updateOrderStatus);

export default router;
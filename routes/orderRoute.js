import express, { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getOrderByUserId } from "../controller/orderController";

const router = express.Router();

router.get("/order", authMiddleware, getOrderByUserId);

export default router;
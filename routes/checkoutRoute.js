import express, { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { checkout } from "../controller/checkoutController";

const router = express.Router();

router.post("/checkout", authMiddleware, checkout);

export default router;
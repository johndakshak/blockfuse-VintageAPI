import express, { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { paymentGateway } from "../controller/paymentController";

const router = express.Router();

router.post("/payment/:id", authMiddleware, paymentGateway);

export default router;
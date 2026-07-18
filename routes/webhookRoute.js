import express, { Router } from "express";
import { verifyPayment } from "../controller/webhookController";

const router = express.Router();

router.post("/webhook/paystack", verifyPayment);

export default router;
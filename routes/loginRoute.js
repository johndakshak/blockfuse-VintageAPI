import express from "express";
import { login } from "../controller/loginController";
import { loginLimiter } from "../middleware/rateLimitMiddleware";

const router = express.Router();

router.post("/login", loginLimiter, login);

export default router;
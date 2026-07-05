import express from "express";
import { authMiddleware } from "../controller/authMiddleware";
import { getCurrentUser } from "../controller/currentUser";

const router = express.Router();

router.get("/me", authMiddleware, getCurrentUser);

export default router;


import express from "express";
import { createUser, getUserById } from "../controller/userController";

const router = express.Router();

router.post("/create", createUser);
router.get("/:id", getUserById);

export default router;

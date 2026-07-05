import express from "express";
import { createUser, getUserById, getAllUsers, updateUser, deleteUser } from "../controller/userController";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware"


const router = express.Router();

router.post("/create", createUser);
router.get("/:id", authMiddleware, getUserById);
router.get("/", authMiddleware, adminMiddleware, getAllUsers);
router.patch("/update/:id", authMiddleware, updateUser);
router.delete("/delete/:id", authMiddleware, deleteUser);

export default router;

import express from "express";
import { createUser, getUserById, getAllUsers, updateUser } from "../controller/userController";

const router = express.Router();

router.post("/create", createUser);
router.get("/:id", getUserById);
router.get("/", getAllUsers);
router.patch("/update/:id", updateUser);

export default router;

import express from "express";
import { createUser, getUserById, getAllUsers } from "../controller/userController";

const router = express.Router();

router.post("/create", createUser);
router.get("/:id", getUserById);
router.get("/", getAllUsers);


export default router;

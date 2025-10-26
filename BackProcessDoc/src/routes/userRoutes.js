import express from "express";
import { registerUser, getMe } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.get("/me", authMiddleware, getMe);

export default router;

import express from "express";
import { register, login, logout, checkUser, checkAdmin, debugToken, refreshToken } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.get("/check-auth", checkUser);
router.get("/check-admin", checkAdmin);
router.get("/debug-token", debugToken);

export default router;

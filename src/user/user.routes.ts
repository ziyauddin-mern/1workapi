import express from "express";
import { forgotPassword, login, signup } from "./user.controller";
const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/forgot-password", forgotPassword);

export default router;

import express from "express";
import {
  forgotPassword,
  login,
  signup,
  logout,
  changePassword,
} from "./user.controller";
import { forgotToken } from "./user.middleware";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/change-password", forgotToken, changePassword);

export default router;

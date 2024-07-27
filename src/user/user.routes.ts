import express from "express";
import {
  forgotPassword,
  login,
  signup,
  logout,
  changePassword,
  refreshToken,
} from "./user.controller";
import { forgotToken, Refresh } from "./user.middleware";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);
router.post("/refresh-token", Refresh, refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/change-password", forgotToken, changePassword);

export default router;

import express from "express";
import { fetch, sendInvitaion } from "./invitation.controller";
import AuthMiddleware from "./auth.middleware";
const router = express.Router();

router.get("/", AuthMiddleware, fetch);
router.post("/", AuthMiddleware, sendInvitaion);

export default router;

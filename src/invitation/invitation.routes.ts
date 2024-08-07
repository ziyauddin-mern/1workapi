import express from "express";
import { fetch, sendInvitaion } from "./invitation.controller";
const router = express.Router();

router.get("/", fetch);
router.post("/", sendInvitaion);

export default router;

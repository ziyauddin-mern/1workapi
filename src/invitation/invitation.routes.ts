import express from "express";
import {
  fetch,
  sendInvitaion,
  updateInvitation,
} from "./invitation.controller";
import AuthMiddleware from "../../middleware/auth.middleware";
const router = express.Router();

router.get("/", AuthMiddleware, fetch);
router.post("/", AuthMiddleware, sendInvitaion);
router.put("/:id", AuthMiddleware, updateInvitation);

export default router;

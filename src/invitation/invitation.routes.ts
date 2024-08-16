import express from "express";
import {
  fetchInvited,
  fetchMineInvitation,
  sendInvitaion,
  updateInvitation,
} from "./invitation.controller";
import AuthMiddleware from "../../middleware/auth.middleware";
import InvitationMeddleware from "./invitation.middleware";
const router = express.Router();

router.get("/invited", AuthMiddleware, fetchInvited);
router.get("/mine", AuthMiddleware, fetchMineInvitation);
router.post("/", AuthMiddleware, InvitationMeddleware, sendInvitaion);
router.put("/:id", AuthMiddleware, updateInvitation);

export default router;

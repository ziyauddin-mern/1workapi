import express from "express";
import {
  fetchInvited,
  fetchMineInvitation,
  sendInvitaion,
  updateInvitation,
} from "./invitation.controller";
import AuthMiddleware from "../../middleware/auth.middleware";
const router = express.Router();

router.get("/invited", AuthMiddleware, fetchInvited);
router.get("/mine", AuthMiddleware, fetchMineInvitation);
router.post("/", AuthMiddleware, sendInvitaion);
router.put("/:id", AuthMiddleware, updateInvitation);

export default router;

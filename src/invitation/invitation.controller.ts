import { NextFunction, Request, Response } from "express";
import Catch from "../../lib/catch.lib";
import InvitationSchema from "./invitation.schema";
import UserSchema from "../user/user.schema";
import jwt from "jsonwebtoken";
import { AuthBodyInterface } from "../../middleware/auth.middleware";
import { getSocket } from "../../lib/socket.lib";
import axios from "axios";
axios.defaults.baseURL = process.env.LAMBDA_ENDPOINT;

const io = getSocket();

let fiveMinutes = "5m";

export const fetch = Catch(async (req: AuthBodyInterface, res: Response) => {
  const member = req.query.member;
  const query = member
    ? { memberEmail: req.user.email, status: "invited" }
    : { admin: req.user._id };
  const invitations = await InvitationSchema.find(query).populate(
    "admin",
    "fullname email"
  );
  res.json(invitations);
});

export const sendInvitaion = Catch(
  async (req: AuthBodyInterface, res: Response) => {
    const invitation = new InvitationSchema({
      admin: req.user._id,
      memberEmail: req.body.email,
    });
    await invitation.save();

    const token = await jwt.sign(
      { session: Date.now() },
      process.env.LAMBDA_MAILER_SECRET as string,
      {
        expiresIn: fiveMinutes,
      }
    );

    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios.post(
      "/mail",
      { email: req.body.email, admin: req.user.fullname },
      options
    );

    io.emit("invitation", {
      memberEmail: req.body.email,
      admin: {
        id: req.user._id,
        fullname: req.user.fullname,
        email: req.user.email,
      },
    });

    res.status(200).json(invitation);
  }
);

export const updateInvitation = Catch(
  async (req: AuthBodyInterface, res: Response) => {
    const invitation = await InvitationSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!invitation) throw new Error("Invalid invitation id");

    const user = await UserSchema.findByIdAndUpdate(req.body.admin, {
      $push: { members: req.user._id },
    });
    if (!user) throw new Error("Invalid invitation id");

    res.json(invitation);
  }
);

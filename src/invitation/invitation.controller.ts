import { Request, Response } from "express";
import Catch from "../../lib/catch.lib";
import InvitationSchema from "./invitation.schema";
import jwt from "jsonwebtoken";
import { AuthBodyInterface } from "./auth.middleware";
import axios from "axios";
axios.defaults.baseURL = process.env.LAMBDA_ENDPOINT;

let fiveMinutes = "5m";

export const fetch = Catch(async (req: AuthBodyInterface, res: Response) => {
  const invitations = await InvitationSchema.find({ admin: req.user._id });
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

    res.status(200).json(invitation);
  }
);

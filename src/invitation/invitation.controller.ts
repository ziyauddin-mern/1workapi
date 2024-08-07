import { Request, Response } from "express";
import Catch from "../../lib/catch.lib";
import InvitationSchema from "./invitation.schema";
import axios from "axios";
import jwt from "jsonwebtoken";

export const fetch = Catch(async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
  });
});

export const sendInvitaion = Catch(async (req: Request, res: Response) => {
  const token = await jwt.sign(
    { session: Date.now() },
    process.env.LAMBDA_MAILER_SECRET as string,
    {
      expiresIn: "5m",
    }
  );

  const { data } = await axios.post(
    "https://ak91d2c2jb.execute-api.ap-south-1.amazonaws.com/v1/mail",
    {
      email: req.body.email,
      subject: "Invitaion mail",
      message: "Hi i am waiting",
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  res.status(200).json(data);
});

import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import Catch from "../../lib/catch.lib";
import { ForgotPaylod } from "./user.dto";
import bcrypt from "bcrypt";

export const forgotToken = Catch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) return res.status(400).send("Unauthorized");

    const [type, token] = authorization.split(" ");
    if (type !== "Bearer") return res.status(400).send("Unauthorized");

    const user: ForgotPaylod = jwt.verify(
      token,
      process.env.FORGOT_SECRET as string
    ) as ForgotPaylod;
    req.params.id = user.id;

    req.body.password = await bcrypt.hash(req.body.password.toString(), 12);

    next();
  }
);

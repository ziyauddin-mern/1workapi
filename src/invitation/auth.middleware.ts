import { NextFunction, Request, Response } from "express";
import Catch from "../../lib/catch.lib";
import jwt from "jsonwebtoken";

export interface AuthBodyInterface extends Request {
  user: {
    _id: string;
    fullname: string;
    email: string;
  };
}

interface UserInterface {
  _id: string;
  fullname: string;
  email: string;
}

const AuthMiddleware = Catch(
  async (req: AuthBodyInterface, res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;

    if (!accessToken) return res.status(401).send("Unauthorized");

    const user: UserInterface = (await jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    )) as UserInterface;

    req.user = user;
    next();
  }
);
export default AuthMiddleware;

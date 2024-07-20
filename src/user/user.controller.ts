import jwt from "jsonwebtoken";
import UserSchema from "./user.schema";
import { Request, Response } from "express";
import { signupDto } from "./user.dto";

const tenMinute = 60;
const cookieExpire = 1000 * 60 * 10;

export const signup = async (req: Request, res: Response) => {
  try {
    const body: signupDto = req.body;
    const newUser = new UserSchema(body);
    await newUser.save();

    const payload = {
      ...body,
      id: newUser._id,
      password: undefined,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: tenMinute,
    });

    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: cookieExpire,
      secure: (process.env.PROD as string) === "false" ? false : true,
      domain: process.env.USER_AGENT as string,
    });

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const login = (req: Request, res: Response) => {
  res.send("Login");
};
export const forgotPassword = (req: Request, res: Response) => {
  res.send("Forgot Password");
};

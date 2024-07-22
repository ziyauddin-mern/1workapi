import jwt from "jsonwebtoken";
import UserSchema from "./user.schema";
import { Request, Response } from "express";
import { GetTokenDto, LoginDto, SignupDto } from "./user.dto";
import bcrypt from "bcrypt";

const tenMinute = 600;
const oneMonth = 2629800;

const cookieExpireInTenMinutes = 600000;
const cookieExpireInOneMonth = 2629800000;

const getToken = (user: GetTokenDto) => {
  user.password = undefined;
  const accessToken = jwt.sign(
    user,
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: tenMinute,
    }
  );

  const refreshToken = jwt.sign(
    { _id: user._id },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: oneMonth,
    }
  );

  return { accessToken, refreshToken };
};

export const signup = async (req: Request, res: Response) => {
  try {
    const body: SignupDto = req.body;
    const newUser = new UserSchema(body);
    await newUser.save();

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const body: LoginDto = req.body;
    const user = await UserSchema.findOne({ email: body.email });
    if (!user)
      return res.status(404).json({
        success: false,
        message: "user not found",
      });

    const isCompared = await bcrypt.compare(body.password, user.password);
    if (!isCompared)
      return res.status(401).json({
        success: false,
        message: "password not matched",
      });

    // Do after login
    const { accessToken, refreshToken } = getToken(user.toObject());

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: cookieExpireInTenMinutes,
      secure: process.env.PROD === "true" ? true : false,
      domain: process.env.USER_AGENT,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: cookieExpireInOneMonth,
      secure: process.env.PROD === "true" ? true : false,
      domain: process.env.USER_AGENT,
    });
    res.status(200).json({
      email: user.email,
      fullname: user.fullname,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    maxAge: 0,
    secure: process.env.PROD === "true" ? true : false,
    domain: process.env.USER_AGENT,
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    maxAge: 0,
    secure: process.env.PROD === "true" ? true : false,
    domain: process.env.USER_AGENT,
  });

  res.status(200).json({ success: true });
};

export const forgotPassword = (req: Request, res: Response) => {
  res.send("Forgot Password");
};

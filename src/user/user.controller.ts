import jwt from "jsonwebtoken";
import UserSchema from "./user.schema";
import { NextFunction, Request, Response } from "express";
import { ForgotRequestDto, GetTokenDto, LoginDto, SignupDto } from "./user.dto";
import bcrypt from "bcrypt";
import Catch from "../../lib/catch.lib";
import { createOtp } from "../otp/otp.controller";
import crypto from "crypto";

const tenMinute = 600;
const fiveMinute = 300;
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

export const signup = Catch(async (req: Request, res: Response) => {
  const body: SignupDto = req.body;
  const user = new UserSchema(body);
  await user.save();
  res.status(200).json({ success: true });
});

export const login = Catch(async (req: Request, res: Response) => {
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
});

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

export const forgotPassword = Catch(
  async (req: Request, res: Response, next: NextFunction) => {
    const body: ForgotRequestDto = req.body;
    const user = await UserSchema.findOne({ email: body.email });
    if (!user)
      return res
        .status(4040)
        .json({ success: false, message: "user does not exist." });

    req.body.code = crypto.randomBytes(4).toString("hex").toUpperCase();
    req.body.disableMicroservice = true;
    await createOtp(req, res, next);

    const token = jwt.sign(
      { id: user._id },
      process.env.FORGOT_SECRET as string,
      { expiresIn: fiveMinute }
    );
    res.status(200).json(token);
  }
);

export const changePassword = Catch(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    await UserSchema.findByIdAndUpdate(id, { password: req.body.password });
    res.status(200).json({ success: true });
  }
);

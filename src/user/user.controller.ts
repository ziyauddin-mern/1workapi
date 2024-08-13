import jwt from "jsonwebtoken";
import UserSchema from "./user.schema";
import { NextFunction, Request, Response } from "express";
import { ForgotRequestDto, GetTokenDto, LoginDto, SignupDto } from "./user.dto";
import bcrypt from "bcrypt";
import Catch from "../../lib/catch.lib";
import { createOtp, verifyOtp } from "../otp/otp.controller";
import crypto from "crypto";
import { sendEmail } from "../../lib/mail.lib";

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
    { id: user._id },
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
    _id: user._id,
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
        .status(404)
        .json({ success: false, message: "user does not exist." });

    const otp = crypto.randomBytes(4).toString("hex").toUpperCase();
    const isSend = await sendEmail(
      user.email,
      "OTP Verification",
      `Your otp is ${otp}`
    );
    if (!isSend)
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });

    req.body.code = otp;
    req.body.disableMicroservice = true;
    await createOtp(req, res, next);

    const token = jwt.sign(
      { id: user._id },
      process.env.FORGOT_SECRET as string,
      { expiresIn: fiveMinute }
    );
    res.status(200).json({ success: true, token });
  }
);

export const changePassword = Catch(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    req.body.disableMicroservice = true;
    const isVerified = await verifyOtp(req, res, next);
    if (!isVerified)
      return res.status(401).json({ success: false, message: "Invalid otp" });

    await UserSchema.findByIdAndUpdate(id, { password: req.body.password });
    res.status(200).json({ success: true });
  }
);

export const refreshToken = Catch(async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = await UserSchema.findById(id);
  if (!user) return res.status(404).send("not found");

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
    _id: user._id,
    email: user.email,
    fullname: user.fullname,
  });
});

// helper
export const fetchUserByEmail = Catch(async (req: Request, res: Response) => {
  const user = await UserSchema.findOne({ email: req.body.email }, { _id: 1 });
  if (!user) throw new Error("User doesn`t exist");
  return user;
});

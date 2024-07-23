import { Request, Response } from "express";
import Catch from "../../lib/catch.lib";
import OtpSchema from "./otp.schema";
import { OtpDto } from "./otp.dto";

export const createOtp = Catch(async (req: Request, res: Response) => {
  const body: OtpDto = req.body;
  const otp = new OtpSchema(body);
  await otp.save();
  if (body.disableMicroservice) return otp;

  res.json(otp);
});

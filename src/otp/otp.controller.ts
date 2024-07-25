import { Request, Response } from "express";
import Catch from "../../lib/catch.lib";
import OtpSchema from "./otp.schema";
import { OtpDto } from "./otp.dto";
import moment from "moment";

export const createOtp = Catch(async (req: Request, res: Response) => {
  const body: OtpDto = req.body;
  const otp = new OtpSchema(body);
  await otp.save();
  if (body.disableMicroservice) return otp;

  res.json(otp);
});

export const verifyOtp = Catch(async (req: Request, res: Response) => {
  const code = req.body.otp;

  const otp = await OtpSchema.findOne({ code });
  if (!otp)
    return req.body.disableMicroservice
      ? false
      : res.status(401).json({ success: false, message: "invalid otp" });

  const { createdAt } = otp;
  const currentDateTime = moment();
  const expiredDateTime = moment(createdAt).add(1, "month");

  const isExpired = currentDateTime >= expiredDateTime;
  if (isExpired)
    return req.body.disableMicroservice
      ? false
      : res.status(401).json({ success: false, message: "Expired otp" });

  return req.body.disableMicroservice
    ? true
    : res.status(200).json({ success: true });
});

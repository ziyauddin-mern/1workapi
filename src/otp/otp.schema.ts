import { Schema, model } from "mongoose";

const modelSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const OtpSchema = model("Otp", modelSchema);
export default OtpSchema;

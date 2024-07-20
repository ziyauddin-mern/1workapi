import bcrypt from "bcrypt";
import { Schema, model } from "mongoose";
import { signupDto } from "./user.dto";
const userSchema = new Schema<signupDto>(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const encryptedPassword = await bcrypt.hash(this.password.toString(), 12);
  this.password = encryptedPassword;
  next();
});

const User = model<signupDto>("User", userSchema);
export default User;

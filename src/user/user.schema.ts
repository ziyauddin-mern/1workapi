import bcrypt from "bcrypt";
import { Schema, Types, model } from "mongoose";
import { UserSchemaDto } from "./user.dto";
const userSchema = new Schema<UserSchemaDto>(
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
    members: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const encryptedPassword = await bcrypt.hash(this.password.toString(), 12);
  this.password = encryptedPassword;
  next();
});

const User = model<UserSchemaDto>("User", userSchema);
export default User;

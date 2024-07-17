import { Document, Schema, model } from "mongoose";

interface userSchemaInterface extends Document {
  fullname: string;
  email: string;
  password: string;
  mobile: number;
}

const userSchema = new Schema<userSchemaInterface>({
  fullname: String,
  email: String,
  password: String,
  mobile: Number,
});

const User = model<userSchemaInterface>("User", userSchema);

export default User;

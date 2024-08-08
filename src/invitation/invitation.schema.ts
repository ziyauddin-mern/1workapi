import { Schema, model, Types } from "mongoose";

const modelSchema = new Schema(
  {
    admin: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    memberEmail: {
      type: String,
      trim: true,
      required: true,
    },
    status: {
      type: String,
      default: "invited",
      enum: ["invited", "accepted", "rejected"],
    },
  },
  {
    timestamps: true,
  }
);

const InvitationSchema = model("Invitation", modelSchema);
export default InvitationSchema;

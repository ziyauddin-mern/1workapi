import { Schema, Types, model } from "mongoose";

const modelSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    owner: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    priority: {
      type: String,
      default: "cold",
      enum: ["cold", "warm", "hot"],
    },
    deadline: {
      type: Date,
      required: true,
    },
    attachments: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      default: "inprogress",
      enum: ["inprogress", "working", "completed", "paused", "canceled"],
    },
  },
  {
    timestamps: true,
  }
);

const TaskSchema = model("Task", modelSchema);
export default TaskSchema;

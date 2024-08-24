import { Request, Response } from "express";
import Catch from "../../lib/catch.lib";
import TaskSchema from "./task.schema";
import { AuthBodyInterface } from "../../middleware/auth.middleware";
import redis from "../../lib/redis.lib";
import { ObjectId } from "mongodb";

const EXPIRE_CATCH = 86400;

export const createTask = Catch(async (req: Request, res: Response) => {
  const newTask = new TaskSchema(req.body);
  await newTask.save();
  res.json(newTask);
});

export const fetchTasks = Catch(
  async (req: AuthBodyInterface, res: Response) => {
    const tasks = await TaskSchema.find({ owner: req.user._id })
      .populate("members", "fullname email")
      .populate("owner", "fullname email");
    res.json(tasks);
  }
);

export const fetchTasksByKanban = Catch(
  async (req: AuthBodyInterface, res: Response) => {
    const redisCatch = await redis.get(req.user._id);
    if (redisCatch) return res.json(JSON.parse(redisCatch));

    const tasks = await TaskSchema.aggregate([
      {
        $match: {
          owner: new ObjectId(req.user._id),
        },
      },
      {
        $group: {
          _id: "$status",
          tasks: {
            $push: {
              _id: "$_id",
              title: "$title",
              description: "$description",
              owner: "$owner",
              members: "$members",
              priority: "$priority",
              deadline: "$deadline",
              attachments: "$attachments",
              status: "$status",
              createdAt: "$createdAt",
              updatedAt: "$updatedAt",
            },
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    await redis.setEx(req.user._id, EXPIRE_CATCH, JSON.stringify(tasks));
    res.json(tasks);
  }
);

export const fetchTaskById = Catch(
  async (req: AuthBodyInterface, res: Response) => {
    const task = await TaskSchema.findById(req.params.id);
    if (!task) throw new Error("Failed to fetch task with id");
    res.json(task);
  }
);

export const updateTask = Catch(
  async (req: AuthBodyInterface, res: Response) => {
    const task = await TaskSchema.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!task) throw new Error("Failed to update task with id");
    res.json(task);
  }
);

export const deleteTask = Catch(
  async (req: AuthBodyInterface, res: Response) => {
    const task = await TaskSchema.findByIdAndDelete(req.params.id);
    if (!task) throw new Error("Failed to delete task with id");
    res.json(task);
  }
);

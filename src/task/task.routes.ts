import express from "express";
import {
  createTask,
  fetchTasks,
  fetchTaskById,
  updateTask,
  deleteTask,
} from "./task.controller";
import AuthMiddleware from "../../middleware/auth.middleware";
const router = express.Router();

router.post("/", AuthMiddleware, createTask);
router.get("/", AuthMiddleware, fetchTasks);
router.get("/:id", AuthMiddleware, fetchTaskById);
router.put("/:id", AuthMiddleware, updateTask);
router.delete("/:id", AuthMiddleware, deleteTask);

export default router;

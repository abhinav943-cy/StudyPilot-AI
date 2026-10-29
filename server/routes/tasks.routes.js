
import { Router } from "express";
import { z } from "zod";
import {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
  createPlan,
  updateStep,
} from "../controllers/tasks.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validators/task.validator.js";

const router = Router();

router.use(requireAuth);

router.get("/", listTasks);
router.post("/", validate(createTaskSchema), createTask);
router.patch("/:id", validate(updateTaskSchema), updateTask);
router.delete("/:id", deleteTask);
router.post("/:id/plan", createPlan);

router.patch(
  "/:id/steps/:stepId",
  validate(z.object({ completed: z.boolean() })),
  updateStep
);

export default router;


import Task from "../models/Task.js";
import { ApiError } from "../utils/apiError.js";
import { generateTaskPlan } from "../services/taskPlanning.service.js";

export async function listTasks(req, res) {
  const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json({ tasks });
}

export async function createTask(req, res) {
  const body = req.validatedBody;

  const task = await Task.create({
    user: req.userId,
    title: body.title,
    subject: body.subject || "General",
    description: body.description || "",
    dueDate: body.dueDate || null,
  });

  res.status(201).json({ task });
}

export async function updateTask(req, res) {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.userId,
  });

  if (!task) throw new ApiError(404, "Task not found");

  const body = req.validatedBody;
  if (body.title !== undefined) task.title = body.title;
  if (body.subject !== undefined) task.subject = body.subject;
  if (body.description !== undefined) task.description = body.description;
  if (body.dueDate !== undefined) task.dueDate = body.dueDate;

  if (body.completed !== undefined) {
    task.completed = body.completed;
    task.completedAt = body.completed ? new Date() : null;
  }

  await task.save();
  res.json({ task });
}

export async function deleteTask(req, res) {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.userId,
  });

  if (!task) throw new ApiError(404, "Task not found");

  res.json({ message: "Task deleted successfully" });
}

export async function createPlan(req, res) {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.userId,
  });

  if (!task) throw new ApiError(404, "Task not found");

  const steps = await generateTaskPlan(task);

  task.steps = steps;
  await task.save();

  res.json({ task, steps });
}

export async function updateStep(req, res) {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.userId,
  });

  if (!task) throw new ApiError(404, "Task not found");

  const step = task.steps.id(req.params.stepId);
  if (!step) throw new ApiError(404, "Study step not found");

  step.completed = Boolean(req.validatedBody.completed);

  await task.save();
  res.json({ task });
}

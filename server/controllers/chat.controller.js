
import Task from "../models/Task.js";
import { askAI } from "../services/ai.service.js";

export async function coachChat(req, res) {
  const message = req.validatedBody.message;

  const pendingTasks = await Task.find({
    user: req.userId,
    completed: false,
  })
    .select("title subject dueDate createdAt")
    .sort({ dueDate: 1, createdAt: -1 })
    .limit(50)
    .lean();

  const answer = await askAI({
    system: `You are StudyPilot AI, a study coach.
Use the supplied task data as the source of truth about pending tasks.
If there are no pending tasks, say so. Never invent tasks or claim
to have completed, deleted, or changed a task.`,
    prompt: JSON.stringify({
      question: message,
      pendingTasks: pendingTasks.map((task) => ({
        title: task.title,
        subject: task.subject,
        dueDate: task.dueDate,
      })),
    }),
  });

  res.json({ answer, pendingCount: pendingTasks.length });
}

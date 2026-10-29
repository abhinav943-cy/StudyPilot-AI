
import { z } from "zod";

export const generateQuizSchema = z.object({
  topic: z.string().trim().min(2).max(200),
  count: z.number().int().min(1).max(10).optional(),
  taskId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
});

export const submitQuizSchema = z.object({
  quizId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  answers: z.record(z.string(), z.string()),
});


import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().trim().min(2).max(200),
  subject: z.string().trim().max(80).optional(),
  description: z.string().max(2000).optional(),
  dueDate: z.string().datetime().nullable().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(2).max(200).optional(),
  subject: z.string().trim().max(80).optional(),
  description: z.string().max(2000).optional(),
  completed: z.boolean().optional(),
  dueDate: z.string().datetime().nullable().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field is required",
});

export const planTaskSchema = z.object({
  taskId: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

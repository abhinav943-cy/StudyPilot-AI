
import { z } from "zod";

export const tutorSchema = z.object({
  message: z.string().trim().min(1).max(4000),
  topic: z.string().trim().max(200).optional(),
  history: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().max(4000),
    })
  ).max(10).optional(),
});

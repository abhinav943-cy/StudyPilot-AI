
import { Router } from "express";
import { z } from "zod";
import { coachChat } from "../controllers/chat.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { aiLimiter } from "../middleware/rateLimit.middleware.js";

const router = Router();

const chatSchema = z.object({
  message: z.string().trim().min(1).max(2000),
});

router.post("/", requireAuth, aiLimiter, validate(chatSchema), coachChat);

export default router;

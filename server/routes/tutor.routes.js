
import { Router } from "express";
import { chatWithTutor } from "../controllers/tutor.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { aiLimiter } from "../middleware/rateLimit.middleware.js";
import { tutorSchema } from "../validators/tutor.validator.js";

const router = Router();

router.post("/chat", requireAuth, aiLimiter, validate(tutorSchema), chatWithTutor);

export default router;

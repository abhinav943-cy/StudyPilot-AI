
import { Router } from "express";
import {
  generateQuiz,
  submitQuiz,
} from "../controllers/quiz.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { aiLimiter } from "../middleware/rateLimit.middleware.js";
import {
  generateQuizSchema,
  submitQuizSchema,
} from "../validators/quiz.validator.js";

const router = Router();

router.use(requireAuth);
router.post("/generate", aiLimiter, validate(generateQuizSchema), generateQuiz);
router.post("/submit", validate(submitQuizSchema), submitQuiz);

export default router;

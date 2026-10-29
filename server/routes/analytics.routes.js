
import { Router } from "express";
import { weeklyAnalytics } from "../controllers/analytics.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/weekly", requireAuth, weeklyAnalytics);

export default router;

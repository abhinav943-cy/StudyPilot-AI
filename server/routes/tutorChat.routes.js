
import { Router } from "express";
import {
  getTutorChats,
  createTutorChat,
  getTutorChat,
  updateTutorChat,
  deleteTutorChat,
} from "../controllers/tutorChat.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", getTutorChats);
router.post("/", createTutorChat);
router.get("/:id", getTutorChat);
router.patch("/:id", updateTutorChat);
router.delete("/:id", deleteTutorChat);

export default router;

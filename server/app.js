
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/tasks.routes.js";
import tutorRoutes from "./routes/tutor.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import tutorChatRoutes from "./routes/tutorChat.routes.js";
import {
  notFound,
  errorHandler,
} from "./middleware/error.middleware.js";
import { apiLimiter } from "./middleware/rateLimit.middleware.js";

const app = express();

app.disable("x-powered-by");

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "100kb" }));
app.use("/api", apiLimiter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "StudyPilot AI API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/tutor", tutorRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/tutor-chats", tutorChatRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;

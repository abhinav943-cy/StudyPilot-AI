

import Task from "../models/Task.js";
import QuizAttempt from "../models/QuizAttempt.js";
import { getWeeklyProgress } from "../services/progress.service.js";

export async function weeklyAnalytics(req, res) {
  const [totalTasks, completedTasks, pendingTasks, quizCount, weekly] =
    await Promise.all([
      Task.countDocuments({ user: req.userId }),
      Task.countDocuments({ user: req.userId, completed: true }),
      Task.countDocuments({ user: req.userId, completed: false }),
      QuizAttempt.countDocuments({
        user: req.userId,
        submittedAt: { $ne: null },
      }),
      getWeeklyProgress(req.userId),
    ]);

  res.json({
    summary: {
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate: totalTasks
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0,
      quizCount,
    },
    weekly,
  });
}

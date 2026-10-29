
import Task from "../models/Task.js";
import QuizAttempt from "../models/QuizAttempt.js";
import StudySession from "../models/StudySession.js";
import { daysAgo } from "../utils/dates.js";

export async function getWeeklyProgress(userId) {
  const since = daysAgo(6);

  const [tasks, attempts, sessions] = await Promise.all([
    Task.find({ user: userId, completedAt: { $gte: since } }).lean(),
    QuizAttempt.find({
      user: userId,
      submittedAt: { $gte: since, $ne: null },
    }).lean(),
    StudySession.find({
      user: userId,
      startedAt: { $gte: since },
    }).lean(),
  ]);

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = daysAgo(6 - index);
    const key = date.toISOString().slice(0, 10);

    const completedTasks = tasks.filter(
      (task) => task.completedAt.toISOString().slice(0, 10) === key
    ).length;

    const dailyAttempts = attempts.filter(
      (attempt) => attempt.submittedAt.toISOString().slice(0, 10) === key
    );

    const dailySessions = sessions.filter(
      (session) => session.startedAt.toISOString().slice(0, 10) === key
    );

    return {
      date: key,
      day: date.toLocaleDateString("en-IN", { weekday: "short" }),
      completedTasks,
      quizzes: dailyAttempts.length,
      averageQuizScore: dailyAttempts.length
        ? Math.round(
            dailyAttempts.reduce((sum, item) => sum + item.score, 0) /
              dailyAttempts.length
          )
        : null,
      studyMinutes: dailySessions.reduce(
        (sum, session) => sum + session.durationMinutes,
        0
      ),
    };
  });

  return {
    days,
    totals: {
      completedTasks: tasks.length,
      quizzes: attempts.length,
      studyMinutes: sessions.reduce(
        (sum, session) => sum + session.durationMinutes,
        0
      ),
    },
  };
}

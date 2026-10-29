
import { getDateKey } from "../../utils/date";

export function getWeeklyProgress(tasks) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));

    const key = getDateKey(date);
    const completed = tasks.filter(
      (task) => task.completed && getDateKey(task.completedAt) === key
    ).length;

    return {
      day: date.toLocaleDateString("en-IN", { weekday: "short" }),
      completed,
    };
  });
}

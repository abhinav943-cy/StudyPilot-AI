
export function getCompletion(tasks) {
  if (!tasks.length) return 0;

  const completed = tasks.filter((task) => task.completed).length;
  return Math.round((completed / tasks.length) * 100);
}

export function getPendingTasks(tasks) {
  return tasks.filter((task) => !task.completed);
}

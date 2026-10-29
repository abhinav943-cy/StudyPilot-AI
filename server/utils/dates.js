
export function startOfDay(date = new Date()) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function daysAgo(count) {
  const date = startOfDay();
  date.setDate(date.getDate() - count);
  return date;
}

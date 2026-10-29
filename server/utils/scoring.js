
export function calculateScore(questions, answers) {
  if (!questions.length) return 0;

  const correct = questions.filter(
    (question, index) =>
      answers[String(index)] === question.correctAnswer
  ).length;

  return Math.round((correct / questions.length) * 100);
}

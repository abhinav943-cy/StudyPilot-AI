
import { askAI } from "./ai.service.js";
import { calculateScore } from "../utils/scoring.js";

export function evaluateQuiz(questions, answers) {
  const score = calculateScore(questions, answers);

  return {
    score,
    correct: questions.filter(
      (question, index) =>
        answers[String(index)] === question.correctAnswer
    ).length,
    total: questions.length,
  };
}

export async function generateQuizFeedback({ topic, score, total }) {
  return askAI({
    system: `You are a supportive study coach.
Give concise, practical feedback for a student's quiz result.
Do not invent which specific questions were wrong.
Suggest one useful next step.`,
    prompt: JSON.stringify({ topic, score, total }),
  });
}

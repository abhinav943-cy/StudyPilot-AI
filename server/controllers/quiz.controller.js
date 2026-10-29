
import QuizAttempt from "../models/QuizAttempt.js";
import Task from "../models/Task.js";
import { ApiError } from "../utils/apiError.js";
import { askAIForJSON } from "../services/ai.service.js";
import {
  QUIZ_SYSTEM_PROMPT,
  normalizeQuizQuestions,
  toPublicQuestions,
  assertValidAnswers,
  gradeMcqQuestions,
  buildEvaluationRequest,
  buildSubmitResult,
} from "../utils/quizeHelper.js";

export async function generateQuiz(req, res) {
  // `count` ab ignore hota hai: quiz hamesha 5 MCQ + 5 written ka hota hai.
  const { topic, taskId } = req.validatedBody;

  if (taskId) {
    const task = await Task.findOne({ _id: taskId, user: req.userId });
    if (!task) throw new ApiError(404, "Task not found");
  }

  // AI kabhi kabhi galat count ya format bhej deta hai, isliye ek baar dobara try.
  let questions = null;

  for (let attempt = 0; attempt < 2 && !questions; attempt += 1) {
    const generated = await askAIForJSON({
      system: QUIZ_SYSTEM_PROMPT,
      prompt: JSON.stringify({ topic }),
      maxTokens: 8000,
      timeoutMs: 90000,
    });

    questions = normalizeQuizQuestions(generated);
  }

  if (!questions) {
    throw new ApiError(502, "AI returned an invalid quiz. Please retry.");
  }

  const quiz = await QuizAttempt.create({
    user: req.userId,
    task: taskId || null,
    topic,
    questions,
  });

  res.status(201).json({
    quizId: quiz._id,
    topic: quiz.topic,
    questions: toPublicQuestions(quiz.questions),
  });
}

export async function submitQuiz(req, res) {
  const { quizId, answers } = req.validatedBody;

  const quiz = await QuizAttempt.findOne({
    _id: quizId,
    user: req.userId,
  });

  if (!quiz) throw new ApiError(404, "Quiz not found");
  if (quiz.submittedAt) throw new ApiError(409, "This quiz was already submitted");

  assertValidAnswers(quiz.questions, answers);

  // 1) MCQ: server khud check karta hai (AI nahi).
  const mcqResults = gradeMcqQuestions(quiz.questions, answers);

  // 2) Written (theory / coding / math): AI check karta hai.
  const evaluationRequest = buildEvaluationRequest({
    topic: quiz.topic,
    questions: quiz.questions,
    answers,
    mcqResults,
  });

  const evaluation = await askAIForJSON({
    ...evaluationRequest,
    maxTokens: 6000,
    timeoutMs: 90000,
  });

  const result = buildSubmitResult({
    questions: quiz.questions,
    answers,
    mcqResults,
    evaluation,
  });

  // AI fail ho jaye to yahan tak pahunchta hi nahi, isliye user dobara submit kar sakta hai.
  quiz.answers = answers;
  quiz.score = result.score;
  quiz.feedback = result.feedback;
  quiz.results = result.results;
  quiz.suggestions = result.suggestions;
  quiz.submittedAt = new Date();
  await quiz.save();

  res.json(result);
}

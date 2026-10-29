
import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },
    topic: { type: String, required: true },
    questions: [
      {
        question: String,
        options: [String],
        correctAnswer: String,
        explanation: String,
      },
    ],
    answers: { type: mongoose.Schema.Types.Mixed, default: {} },
    score: { type: Number, min: 0, max: 100, default: null },
    feedback: { type: String, default: "" },
    submittedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("QuizAttempt", quizAttemptSchema);

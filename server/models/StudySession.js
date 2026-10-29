
import mongoose from "mongoose";

const studySessionSchema = new mongoose.Schema(
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
    startedAt: { type: Date, required: true, default: Date.now },
    endedAt: { type: Date, default: null },
    durationMinutes: { type: Number, min: 0, default: 0 },
    notes: { type: String, maxlength: 2000, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("StudySession", studySessionSchema);

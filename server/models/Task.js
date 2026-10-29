
import mongoose from "mongoose";

const stepSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    completed: { type: Boolean, default: false },
  },
  { _id: true }
);

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    subject: { type: String, default: "General", maxlength: 80 },
    description: { type: String, default: "", maxlength: 2000 },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
    dueDate: { type: Date, default: null },
    steps: { type: [stepSchema], default: [] },
  },
  { timestamps: true }
);

taskSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Task", taskSchema);

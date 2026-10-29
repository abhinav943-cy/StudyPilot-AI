
import { askAIForJSON } from "./ai.service.js";
import { ApiError } from "../utils/apiError.js";

export async function generateTaskPlan(task) {
  const result = await askAIForJSON({
    system: `You are StudyPilot AI, a practical programming study coach.
Return a JSON object with a "steps" array.
Each step must contain "title" and "description".
Create 3 to 8 specific, ordered, beginner-friendly learning steps.
Do not claim that a step is completed. Do not include markdown.`,
    prompt: JSON.stringify({
      task: task.title,
      subject: task.subject,
      goal: task.description,
    }),
  });

  if (
    !Array.isArray(result.steps) ||
    result.steps.length < 3 ||
    result.steps.length > 8 ||
    !result.steps.every(
      (step) =>
        typeof step.title === "string" &&
        typeof step.description === "string" &&
        step.title.trim() &&
        step.description.trim()
    )
  ) {
    throw new ApiError(502, "AI returned an invalid study plan");
  }

  return result.steps.map((step) => ({
    title: step.title.slice(0, 200),
    description: step.description.slice(0, 1000),
    completed: false,
  }));
}

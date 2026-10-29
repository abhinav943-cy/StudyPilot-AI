
import { useEffect, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  CheckCircle2,
  BookOpen,
} from "lucide-react";

function parseContent(content) {
  if (typeof content !== "string") return content;

  try {
    const cleaned = content
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "");

    const parsed = JSON.parse(cleaned);

    if (parsed && typeof parsed === "object") {
      return parsed;
    }
  } catch {
    // Old messages may contain ordinary text.
  }

  return { answer: content };
}

function StateDetails({ state }) {
  if (!state || typeof state !== "object") return null;

  const hidden = new Set(["array"]);

  return (
    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
      {Object.entries(state)
        .filter(([key, value]) =>
          !hidden.has(key) &&
          value !== null &&
          typeof value !== "object"
        )
        .map(([key, value]) => (
          <div
            key={key}
            className="min-w-0 rounded-lg border border-slate-700 bg-slate-900/70 p-3"
          >
            <p className="text-xs capitalize text-slate-400">
              {key.replace(/([A-Z])/g, " $1")}
            </p>
            <p className="mt-1 break-words font-semibold text-slate-100">
              {String(value)}
            </p>
          </div>
        ))}
    </div>
  );
}

function ArrayVisualization({ state }) {
  const array = state?.array;

  if (!Array.isArray(array)) return null;

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2">
        {array.map((value, index) => {
          const isMid = state.mid === index;
          const isTarget = state.target === value;
          const isFound = state.found && isTarget;
          const outsideRange =
            Number.isInteger(state.low) &&
            Number.isInteger(state.high) &&
            (index < state.low || index > state.high);

          let style =
            "border-slate-700 bg-slate-900 text-slate-100";

          if (outsideRange) {
            style = "border-slate-800 bg-slate-950 text-slate-600";
          }

          if (isMid) {
            style = "border-amber-400 bg-amber-500/20 text-amber-200";
          }

          if (isFound) {
            style = "border-emerald-400 bg-emerald-500/20 text-emerald-200";
          }

          return (
            <div
              key={index}
              className={`flex min-w-12 flex-col items-center rounded-lg border-2 px-3 py-2 ${style}`}
            >
              <span className="font-bold">{String(value)}</span>
              <span className="mt-1 text-xs opacity-75">
                index {index}
              </span>
              {isMid && (
                <span className="mt-1 text-xs font-semibold">MID</span>
              )}
              {isFound && (
                <CheckCircle2 size={15} className="mt-1" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
        {Number.isInteger(state.low) && <span>Low: {state.low}</span>}
        {Number.isInteger(state.high) && <span>High: {state.high}</span>}
        {Number.isInteger(state.mid) && <span>Mid: {state.mid}</span>}
        {"target" in state && <span>Target: {String(state.target)}</span>}
      </div>
    </div>
  );
}

function Visualization({ visualization }) {
  const steps = Array.isArray(visualization.steps)
    ? visualization.steps
    : [];

  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setStepIndex(-1);
    setPlaying(false);
  }, [visualization]);

  useEffect(() => {
    if (!playing) return;

    const timer = setInterval(() => {
      setStepIndex((current) => {
        if (current >= steps.length - 1) {
          setPlaying(false);
          return current;
        }

        return current + 1;
      });
    }, 1800);

    return () => clearInterval(timer);
  }, [playing, steps.length]);

  if (!visualization.enabled) return null;

  const currentStep = stepIndex < 0 ? null : steps[stepIndex];
  const state = currentStep?.state ?? visualization.initialState ?? {};
  const isLastStep = steps.length === 0 || stepIndex >= steps.length - 1;

  function reset() {
    setPlaying(false);
    setStepIndex(-1);
  }

  function next() {
    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  }

  function previous() {
    setStepIndex((current) => Math.max(current - 1, -1));
  }

  return (
    <section className="mt-5 overflow-hidden rounded-xl border border-slate-700 bg-slate-950/70">
      <div className="border-b border-slate-700 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-300">
          Interactive visualization
        </p>
        <h3 className="mt-1 text-lg font-bold text-white">
          {visualization.title || "Step-by-step simulation"}
        </h3>
      </div>

      <div className="p-4">
        <p className="font-semibold text-slate-100">
          {currentStep?.title || "Initial state"}
        </p>
        <p className="mt-1 text-sm text-slate-300">
          {currentStep?.description ||
            "Simulation shuru karne ke liye Next Step dabao."}
        </p>

        <ArrayVisualization state={state} />
        <StateDetails state={state} />

        {state.found && (
          <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-300">
            <CheckCircle2 size={18} />
            Target found!
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPlaying((value) => !value)}
            disabled={steps.length === 0 || isLastStep && !playing}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white disabled:opacity-40"
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
            {playing ? "Pause" : "Play"}
          </button>

          <button
            type="button"
            onClick={previous}
            disabled={stepIndex < 0 || playing}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-white disabled:opacity-40"
          >
            <SkipBack size={16} />
            Previous
          </button>

          <button
            type="button"
            onClick={next}
            disabled={isLastStep || playing}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-white disabled:opacity-40"
          >
            Next Step
            <SkipForward size={16} />
          </button>

          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-white"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          Step {Math.max(stepIndex + 1, 0)} of {steps.length}
        </p>

        {isLastStep && stepIndex >= 0 && visualization.finalState && (
          <div className="mt-4 rounded-lg border border-emerald-800 bg-emerald-950/30 p-3">
            <p className="font-semibold text-emerald-300">Final result</p>
            <StateDetails state={visualization.finalState} />
          </div>
        )}
      </div>
    </section>
  );
}

export default function TutorMessage({ content }) {
  const data = parseContent(content);

  if (!data || typeof data !== "object") {
    return <p>{String(content ?? "")}</p>;
  }

  const answer =
    typeof data.answer === "string"
      ? data.answer
      : typeof content === "string"
        ? content
        : "";

  return (
    <div className="min-w-0 space-y-3">
      <div className="whitespace-pre-wrap break-words">{answer}</div>

      {data.visualization?.enabled && (
        <Visualization visualization={data.visualization} />
      )}

      {Array.isArray(data.learningResources) &&
        data.learningResources.length > 0 && (
          <div className="mt-4 border-t border-slate-700 pt-4">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-white">
              <BookOpen size={17} />
              Learning resources
            </h3>

            <div className="space-y-2">
              {data.learningResources.map((resource, index) => {
                let safeUrl;

                try {
                  const url = new URL(resource.url);
                  if (url.protocol === "https:" || url.protocol === "http:") {
                    safeUrl = url.href;
                  }
                } catch {
                  // Ignore invalid URLs.
                }

                if (!safeUrl) return null;

                return (
                  <a
                    key={`${resource.title}-${index}`}
                    href={safeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg border border-slate-700 p-3 hover:bg-slate-800"
                  >
                    <span className="font-medium text-blue-300">
                      {resource.title || "Open learning resource"}
                    </span>
                    {resource.reason && (
                      <span className="mt-1 block text-sm text-slate-400">
                        {resource.reason}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        )}
    </div>
  );
}

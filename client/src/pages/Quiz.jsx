
// import { useState } from "react";
// import { BrainCircuit, CheckCircle2, Sparkles } from "lucide-react";
// import { api } from "../services/api";

// export default function Quiz() {
//   const [topic, setTopic] = useState("Java LinkedList");
//   const [quizId, setQuizId] = useState("");
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [submitted, setSubmitted] = useState(false);

//   async function generateQuiz(event) {
//     event.preventDefault();

//     setLoading(true);
//     setError("");
//     setResult(null);
//     setQuizId("");
//     setQuestions([]);
//     setAnswers({});
//     setSubmitted(false);

//     try {
//       const data = await api.generateQuiz(topic.trim(), 5);

//       if (!data.quizId) {
//         throw new Error("Backend response mein quizId nahi mila.");
//       }

//       if (!Array.isArray(data.questions) || !data.questions.length) {
//         throw new Error("Backend ne valid questions return nahi kiye.");
//       }

//       setQuizId(data.quizId);
//       setQuestions(data.questions);
//     } catch (err) {
//       setError(err.message || "Quiz generate nahi ho paya.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function submitQuiz() {
//     if (!quizId) {
//       setError("Quiz ID missing hai. Naya quiz generate karo.");
//       return;
//     }

//     if (questions.some((question) => answers[question.id] == null)) {
//       setError("Submit karne se pehle sabhi questions ke answers select karo.");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const data = await api.submitQuiz(quizId, answers);
//       setResult(data);
//       setSubmitted(true);
//     } catch (err) {
//       setError(err.message || "Quiz evaluate nahi ho paya.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="mx-auto max-w-4xl space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-white md:text-3xl">
//           Practice Quiz
//         </h1>
//         <p className="mt-2 text-slate-400">
//           Generate AI questions and test your understanding.
//         </p>
//       </div>

//       <form
//         onSubmit={generateQuiz}
//         className="panel flex flex-col gap-3 p-5 sm:flex-row"
//       >
//         <input
//           className="input-field flex-1"
//           value={topic}
//           onChange={(event) => setTopic(event.target.value)}
//           placeholder="Enter a topic, e.g. JavaScript closures"
//           required
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="primary-btn disabled:opacity-50"
//         >
//           <Sparkles size={18} />
//           {loading ? "Please wait..." : "Generate AI Quiz"}
//         </button>
//       </form>

//       {error && (
//         <p
//           role="alert"
//           className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300"
//         >
//           {error}
//         </p>
//       )}

//       {!questions.length && (
//         <div className="panel p-10 text-center">
//           <BrainCircuit
//             className="mx-auto text-violet-300"
//             size={40}
//           />
//           <p className="mt-3 font-semibold text-white">
//             Your quiz starts here
//           </p>
//           <p className="mt-2 text-sm text-slate-400">
//             Enter a topic and generate questions using your AI backend.
//           </p>
//         </div>
//       )}

//       {questions.map((question, index) => (
//         <section
//           key={question.id}
//           className="panel space-y-4 p-5"
//         >
//           <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">
//             Question {index + 1} of {questions.length}
//           </p>

//           <h2 className="font-semibold leading-6 text-white">
//             {question.question}
//           </h2>

//           <div className="space-y-2">
//             {question.options.map((option) => {
//               const value =
//                 typeof option === "string" ? option : option.value;

//               const label =
//                 typeof option === "string" ? option : option.label;

//               return (
//                 <label
//                   key={value}
//                   className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm ${
//                     answers[question.id] === value
//                       ? "border-violet-500 bg-violet-500/10 text-white"
//                       : "border-slate-800 text-slate-300 hover:bg-slate-800/60"
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     name={question.id}
//                     value={value}
//                     checked={answers[question.id] === value}
//                     disabled={submitted || loading}
//                     onChange={() =>
//                       setAnswers((current) => ({
//                         ...current,
//                         [question.id]: value,
//                       }))
//                     }
//                     className="accent-violet-500"
//                   />

//                   {label}
//                 </label>
//               );
//             })}
//           </div>
//         </section>
//       ))}

//       {questions.length > 0 && !submitted && (
//         <button
//           type="button"
//           className="primary-btn disabled:cursor-not-allowed disabled:opacity-50"
//           disabled={
//             loading ||
//             !quizId ||
//             questions.some((question) => answers[question.id] == null)
//           }
//           onClick={submitQuiz}
//         >
//           <CheckCircle2 size={18} />
//           {loading ? "Evaluating..." : "Submit answers"}
//         </button>
//       )}

//       {result && (
//         <div className="panel space-y-3 p-6">
//           <h2 className="text-xl font-bold text-white">
//             Quiz results
//           </h2>

//           <p className="text-3xl font-bold text-violet-300">
//             {result.score ?? result.percentage ?? "—"}
//             {result.score != null || result.percentage != null ? "%" : ""}
//           </p>

//           <p className="text-slate-300">
//             {result.feedback ||
//               result.message ||
//               "Evaluation completed."}
//           </p>

//           <button
//             type="button"
//             onClick={() => {
//               setQuestions([]);
//               setAnswers({});
//               setQuizId("");
//               setResult(null);
//               setSubmitted(false);
//               setError("");
//             }}
//             className="secondary-btn"
//           >
//             Generate another quiz
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }







// import { useEffect, useRef, useState } from "react";
// import {
//   AlertCircle,
//   BookOpen,
//   BrainCircuit,
//   CheckCircle2,
//   Code,
//   Lightbulb,
//   LoaderCircle,
//   Sparkles,
//   XCircle,
// } from "lucide-react";
// import { api } from "../services/api";

// // Quiz hamesha 5 questions ka rahega.
// // Coding/DSA topic ho to backend 3 theory + 2 coding questions bhejta hai.
// const QUESTION_COUNT = 5;

// const VERDICT_STYLES = {
//   correct: {
//     label: "Correct",
//     icon: CheckCircle2,
//     badge: "bg-emerald-500/10 text-emerald-300",
//     border: "border-emerald-500/40",
//   },
//   partial: {
//     label: "Partially correct",
//     icon: AlertCircle,
//     badge: "bg-amber-500/10 text-amber-300",
//     border: "border-amber-500/40",
//   },
//   wrong: {
//     label: "Needs improvement",
//     icon: XCircle,
//     badge: "bg-red-500/10 text-red-300",
//     border: "border-red-500/40",
//   },
// };

// function getVerdict(review) {
//   if (!review) return null;
//   if (VERDICT_STYLES[review.verdict]) return review.verdict;
//   if (typeof review.isCorrect === "boolean") {
//     return review.isCorrect ? "correct" : "wrong";
//   }
//   return null;
// }

// function toList(value) {
//   if (Array.isArray(value)) return value.filter(Boolean);
//   return value ? [value] : [];
// }

// export default function Quiz() {
//   const [topic, setTopic] = useState("Java LinkedList");
//   const [quizId, setQuizId] = useState("");
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [submitted, setSubmitted] = useState(false);

//   const resultRef = useRef(null);

//   // Result aate hi summary (score, feedback, suggestions) tak scroll karo.
//   useEffect(() => {
//     if (result) {
//       resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//     }
//   }, [result]);

//   function setAnswer(questionId, value) {
//     setAnswers((current) => ({ ...current, [questionId]: value }));
//   }

//   function resetQuiz() {
//     setQuestions([]);
//     setAnswers({});
//     setQuizId("");
//     setResult(null);
//     setSubmitted(false);
//     setError("");
//   }

//   async function generateQuiz(event) {
//     event.preventDefault();

//     setLoading(true);
//     resetQuiz();

//     try {
//       const data = await api.generateQuiz(topic.trim(), QUESTION_COUNT);

//       if (!data.quizId) {
//         throw new Error("Backend response mein quizId nahi mila.");
//       }

//       if (!Array.isArray(data.questions) || !data.questions.length) {
//         throw new Error("Backend ne valid questions return nahi kiye.");
//       }

//       setQuizId(data.quizId);
//       setQuestions(
//         data.questions.map((question, index) => ({
//           ...question,
//           id: question.id ?? `q${index + 1}`,
//           type: question.type === "coding" ? "coding" : "theory",
//         }))
//       );
//     } catch (err) {
//       setError(err.message || "Quiz generate nahi ho paya.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   const answeredCount = questions.filter((question) =>
//     (answers[question.id] ?? "").trim()
//   ).length;

//   async function submitQuiz() {
//     if (!quizId) {
//       setError("Quiz ID missing hai. Naya quiz generate karo.");
//       return;
//     }

//     if (answeredCount === 0) {
//       setError("Submit karne se pehle kam se kam ek answer likho.");
//       return;
//     }

//     const unanswered = questions.length - answeredCount;

//     if (
//       unanswered > 0 &&
//       !window.confirm(
//         `${unanswered} question(s) khali hain. Phir bhi submit karna hai?`
//       )
//     ) {
//       return;
//     }

//     // { questionId: "written answer" } — khali answers "" ke roop me jayenge.
//     const payload = Object.fromEntries(
//       questions.map((question) => [
//         question.id,
//         (answers[question.id] ?? "").trim(),
//       ])
//     );

//     setLoading(true);
//     setError("");

//     try {
//       const data = await api.submitQuiz(quizId, payload);
//       setResult(data);
//       setSubmitted(true);
//     } catch (err) {
//       setError(err.message || "Quiz evaluate nahi ho paya.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   // ---- Result ko screen ke hisaab se tayyar karo ----
//   const reviews = Array.isArray(result?.results) ? result.results : [];
//   const reviewById = Object.fromEntries(
//     reviews.map((review) => [String(review.questionId ?? review.id), review])
//   );

//   const counts = { correct: 0, partial: 0, wrong: 0 };
//   questions.forEach((question) => {
//     const verdict = getVerdict(reviewById[String(question.id)]);
//     if (verdict) counts[verdict] += 1;
//   });
//   const hasVerdicts = counts.correct + counts.partial + counts.wrong > 0;

//   // Backend score (percentage) de to wahi, warna verdicts se nikal lo.
//   const score =
//     result?.score ??
//     result?.percentage ??
//     (hasVerdicts && questions.length
//       ? Math.round(
//           ((counts.correct + counts.partial * 0.5) / questions.length) * 100
//         )
//       : null);

//   const suggestions = toList(result?.suggestions);

//   return (
//     <div className="mx-auto max-w-4xl space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-white md:text-3xl">
//           Practice Quiz
//         </h1>
//         <p className="mt-2 text-slate-400">
//           Generate AI questions, write your answers and get detailed feedback.
//         </p>
//       </div>

//       <form
//         onSubmit={generateQuiz}
//         className="panel flex flex-col gap-3 p-5 sm:flex-row"
//       >
//         <input
//           className="input-field flex-1"
//           value={topic}
//           onChange={(event) => setTopic(event.target.value)}
//           placeholder="Enter a topic, e.g. JavaScript closures"
//           required
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="primary-btn disabled:opacity-50"
//         >
//           <Sparkles size={18} />
//           {loading && !questions.length ? "Please wait..." : "Generate AI Quiz"}
//         </button>
//       </form>

//       {error && (
//         <p
//           role="alert"
//           className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300"
//         >
//           {error}
//         </p>
//       )}

//       {!questions.length && (
//         <div className="panel p-10 text-center">
//           <BrainCircuit className="mx-auto text-violet-300" size={40} />
//           <p className="mt-3 font-semibold text-white">Your quiz starts here</p>
//           <p className="mt-2 text-sm text-slate-400">
//             Enter a topic to get {QUESTION_COUNT} written questions. Coding
//             topics get 3 theory and 2 practical coding questions.
//           </p>
//         </div>
//       )}

//       {/* Summary: score + feedback + suggestions */}
//       {result && (
//         <div ref={resultRef} className="panel scroll-mt-4 space-y-5 p-6">
//           <div className="flex flex-wrap items-start justify-between gap-4">
//             <div className="min-w-0 flex-1">
//               <h2 className="text-xl font-bold text-white">Quiz results</h2>
//               <p className="mt-2 whitespace-pre-wrap text-slate-300">
//                 {result.feedback || result.message || "Evaluation completed."}
//               </p>
//             </div>

//             <p className="text-4xl font-bold text-violet-300">
//               {score != null ? `${score}%` : "—"}
//             </p>
//           </div>

//           {hasVerdicts && (
//             <div className="flex flex-wrap gap-2 text-xs">
//               {Object.entries(VERDICT_STYLES).map(([key, style]) => {
//                 const Icon = style.icon;

//                 return (
//                   <span
//                     key={key}
//                     className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 ${style.badge}`}
//                   >
//                     <Icon size={13} />
//                     {counts[key]} {style.label.toLowerCase()}
//                   </span>
//                 );
//               })}
//             </div>
//           )}

//           {suggestions.length > 0 && (
//             <div className="rounded-xl border border-slate-800 bg-[#080b14] p-4">
//               <p className="flex items-center gap-2 font-semibold text-white">
//                 <Lightbulb size={18} className="text-amber-300" />
//                 Suggestions to improve
//               </p>

//               <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
//                 {suggestions.map((suggestion, index) => (
//                   <li key={index}>{suggestion}</li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           <p className="text-sm text-slate-400">
//             Neeche har question ka review hai — galat ya adhoore answers ka
//             explanation aur sahi answer bhi diya gaya hai.
//           </p>
//         </div>
//       )}

//       {/* Questions: answer boxes (pehle) -> review (submit ke baad) */}
//       {questions.map((question, index) => {
//         const review = reviewById[String(question.id)];
//         const verdict = getVerdict(review);
//         const verdictStyle = verdict ? VERDICT_STYLES[verdict] : null;
//         const VerdictIcon = verdictStyle?.icon;
//         const isCoding = question.type === "coding";
//         const answerText = answers[question.id] ?? "";

//         return (
//           <section
//             key={question.id}
//             className={`panel space-y-4 p-5 ${
//               verdictStyle ? `border ${verdictStyle.border}` : ""
//             }`}
//           >
//             <div className="flex flex-wrap items-center justify-between gap-2">
//               <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">
//                 Question {index + 1} of {questions.length}
//               </p>

//               <div className="flex flex-wrap items-center gap-2">
//                 <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
//                   {isCoding ? <Code size={13} /> : <BookOpen size={13} />}
//                   {isCoding ? "Coding" : "Theory"}
//                 </span>

//                 {verdictStyle && (
//                   <span
//                     className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs ${verdictStyle.badge}`}
//                   >
//                     <VerdictIcon size={13} />
//                     {verdictStyle.label}
//                   </span>
//                 )}
//               </div>
//             </div>

//             <h2 className="whitespace-pre-wrap break-words font-semibold leading-6 text-white">
//               {question.question}
//             </h2>

//             {isCoding && question.language && (
//               <p className="text-xs text-slate-400">
//                 Write your solution in {question.language}.
//               </p>
//             )}

//             {!submitted ? (
//               <textarea
//                 value={answerText}
//                 onChange={(event) => setAnswer(question.id, event.target.value)}
//                 rows={isCoding ? 9 : 5}
//                 maxLength={isCoding ? 4000 : 1500}
//                 spellCheck={!isCoding}
//                 disabled={loading}
//                 aria-label={`Answer for question ${index + 1}`}
//                 placeholder={
//                   isCoding
//                     ? "Apna code yahan likho..."
//                     : "Apna answer apne words mein likho..."
//                 }
//                 className={`input-field h-auto w-full resize-y ${
//                   isCoding ? "font-mono text-sm leading-6" : "leading-7"
//                 }`}
//               />
//             ) : (
//               <div className="space-y-4">
//                 <div>
//                   <p className="mb-1 text-xs font-semibold text-slate-400">
//                     Your answer
//                   </p>

//                   {answerText.trim() ? (
//                     <pre
//                       className={`rounded-xl border border-slate-800 bg-[#080b14] p-3 text-sm text-slate-200 ${
//                         isCoding
//                           ? "overflow-x-auto whitespace-pre font-mono leading-6"
//                           : "whitespace-pre-wrap break-words font-sans leading-7"
//                       }`}
//                     >
//                       {answerText}
//                     </pre>
//                   ) : (
//                     <p className="text-sm italic text-slate-500">
//                       Answer nahi likha.
//                     </p>
//                   )}
//                 </div>

//                 {review?.feedback && (
//                   <div>
//                     <p className="mb-1 text-xs font-semibold text-slate-400">
//                       Feedback
//                     </p>
//                     <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">
//                       {review.feedback}
//                     </p>
//                   </div>
//                 )}

//                 {verdict !== "correct" && review?.explanation && (
//                   <div className="rounded-xl border border-slate-800 bg-[#080b14] p-4">
//                     <p className="mb-1 text-xs font-semibold text-amber-300">
//                       Explanation
//                     </p>
//                     <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">
//                       {review.explanation}
//                     </p>
//                   </div>
//                 )}

//                 {verdict !== "correct" && review?.correctAnswer && (
//                   <div>
//                     <p className="mb-1 text-xs font-semibold text-emerald-300">
//                       Correct answer
//                     </p>
//                     <pre
//                       className={`rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-slate-200 ${
//                         isCoding
//                           ? "overflow-x-auto whitespace-pre font-mono leading-6"
//                           : "whitespace-pre-wrap break-words font-sans leading-7"
//                       }`}
//                     >
//                       {review.correctAnswer}
//                     </pre>
//                   </div>
//                 )}
//               </div>
//             )}
//           </section>
//         );
//       })}

//       {/* Submit: sabse last me */}
//       {questions.length > 0 && !submitted && (
//         <div className="space-y-3">
//           <div className="flex flex-wrap items-center gap-4">
//             <button
//               type="button"
//               className="primary-btn disabled:cursor-not-allowed disabled:opacity-50"
//               disabled={loading || !quizId || answeredCount === 0}
//               onClick={submitQuiz}
//             >
//               {loading ? (
//                 <LoaderCircle size={18} className="animate-spin" />
//               ) : (
//                 <CheckCircle2 size={18} />
//               )}
//               {loading ? "Evaluating answers..." : "Submit answers"}
//             </button>

//             <p className="text-sm text-slate-400">
//               {answeredCount} of {questions.length} answered
//             </p>
//           </div>

//           {loading && (
//             <p className="text-sm text-slate-400">
//               AI tumhare written answers check kar raha hai, thoda time lag
//               sakta hai.
//             </p>
//           )}
//         </div>
//       )}

//       {submitted && (
//         <button type="button" onClick={resetQuiz} className="secondary-btn">
//           Generate another quiz
//         </button>
//       )}
//     </div>
//   );
// }






// import { useEffect, useRef, useState } from "react";
// import {
//   AlertCircle,
//   BookOpen,
//   BrainCircuit,
//   Calculator,
//   CheckCircle2,
//   Code,
//   Lightbulb,
//   ListChecks,
//   LoaderCircle,
//   Sparkles,
//   XCircle,
// } from "lucide-react";
// import { api } from "../services/api";

// // Total 10 questions: 5 single-select + 5 written.
// // Written 5 ka type topic se decide hota hai (backend karta hai):
// //   coding topic -> code likhna padega, math topic -> problem solve karni padegi,
// //   baaki topics -> theory answer.
// const MCQ_COUNT = 5;
// const WRITTEN_COUNT = 5;
// const TOTAL_QUESTIONS = MCQ_COUNT + WRITTEN_COUNT;

// const VERDICT_STYLES = {
//   correct: {
//     label: "Correct",
//     icon: CheckCircle2,
//     badge: "bg-emerald-500/10 text-emerald-300",
//     border: "border-emerald-500/40",
//   },
//   partial: {
//     label: "Partially correct",
//     icon: AlertCircle,
//     badge: "bg-amber-500/10 text-amber-300",
//     border: "border-amber-500/40",
//   },
//   wrong: {
//     label: "Needs improvement",
//     icon: XCircle,
//     badge: "bg-red-500/10 text-red-300",
//     border: "border-red-500/40",
//   },
// };

// const TYPE_META = {
//   mcq: { label: "Single select", icon: ListChecks },
//   theory: { label: "Theory", icon: BookOpen },
//   coding: { label: "Coding", icon: Code },
//   math: { label: "Math", icon: Calculator },
// };

// // Written questions ke answer box ki settings.
// const WRITTEN_INPUT = {
//   theory: {
//     rows: 5,
//     maxLength: 1500,
//     mono: false,
//     placeholder: "Apna answer apne words mein likho...",
//   },
//   coding: {
//     rows: 10,
//     maxLength: 4000,
//     mono: true,
//     placeholder: "Apna code yahan likho...",
//   },
//   math: {
//     rows: 7,
//     maxLength: 2000,
//     mono: false,
//     placeholder: "Steps likho aur last me final answer likho...",
//   },
// };

// const WRITTEN_HINTS = {
//   coding: "Har problem ka code khud likho, phir last me submit karo.",
//   math: "Har problem solve karo: steps likho aur last me final answer likho.",
//   theory: "Har question ka answer apne words me likho.",
// };

// const OPTION_TONES = {
//   idle: "border-slate-800 text-slate-300",
//   selected: "border-violet-500 bg-violet-500/10 text-white",
//   correct: "border-emerald-500 bg-emerald-500/10 text-white",
//   wrong: "border-red-500 bg-red-500/10 text-white",
// };

// function getVerdict(review) {
//   if (!review) return null;
//   if (VERDICT_STYLES[review.verdict]) return review.verdict;
//   if (typeof review.isCorrect === "boolean") {
//     return review.isCorrect ? "correct" : "wrong";
//   }
//   return null;
// }

// function toList(value) {
//   if (Array.isArray(value)) return value.filter(Boolean);
//   return value ? [value] : [];
// }

// function optionParts(option) {
//   if (typeof option === "string") return { value: option, label: option };
//   return { value: option.value, label: option.label ?? option.value };
// }

// function matchesCorrect(option, correctAnswer) {
//   if (correctAnswer == null) return false;
//   const { value, label } = optionParts(option);
//   return (
//     String(correctAnswer) === String(value) ||
//     String(correctAnswer) === String(label)
//   );
// }

// function normalizeType(question) {
//   if (Array.isArray(question.options) && question.options.length) return "mcq";
//   if (question.type === "coding" || question.type === "math") {
//     return question.type;
//   }
//   return "theory";
// }

// function formatPoints(points) {
//   return Number.isInteger(points) ? String(points) : points.toFixed(1);
// }

// function SectionHeading({ title, hint }) {
//   return (
//     <div>
//       <h2 className="text-lg font-bold text-white">{title}</h2>
//       {hint && <p className="mt-1 text-sm text-slate-400">{hint}</p>}
//     </div>
//   );
// }

// export default function Quiz() {
//   const [topic, setTopic] = useState("Java LinkedList");
//   const [quizId, setQuizId] = useState("");
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [submitted, setSubmitted] = useState(false);

//   const resultRef = useRef(null);

//   // Result aate hi summary (score, feedback, suggestions) tak scroll karo.
//   useEffect(() => {
//     if (result) {
//       resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//     }
//   }, [result]);

//   function setAnswer(questionId, value) {
//     setAnswers((current) => ({ ...current, [questionId]: value }));
//   }

//   function resetQuiz() {
//     setQuestions([]);
//     setAnswers({});
//     setQuizId("");
//     setResult(null);
//     setSubmitted(false);
//     setError("");
//   }

//   async function generateQuiz(event) {
//     event.preventDefault();

//     setLoading(true);
//     resetQuiz();

//     try {
//       const data = await api.generateQuiz(topic.trim(), TOTAL_QUESTIONS);

//       if (!data.quizId) {
//         throw new Error("Backend response mein quizId nahi mila.");
//       }

//       if (!Array.isArray(data.questions) || !data.questions.length) {
//         throw new Error("Backend ne valid questions return nahi kiye.");
//       }

//       setQuizId(data.quizId);
//       setQuestions(
//         data.questions.map((question, index) => ({
//           ...question,
//           id: question.id ?? `q${index + 1}`,
//           type: normalizeType(question),
//         }))
//       );
//     } catch (err) {
//       setError(err.message || "Quiz generate nahi ho paya.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   function isAnswered(question) {
//     const value = answers[question.id];
//     return value != null && String(value).trim() !== "";
//   }

//   const answeredCount = questions.filter(isAnswered).length;

//   async function submitQuiz() {
//     if (!quizId) {
//       setError("Quiz ID missing hai. Naya quiz generate karo.");
//       return;
//     }

//     if (answeredCount === 0) {
//       setError("Submit karne se pehle kam se kam ek answer do.");
//       return;
//     }

//     const unanswered = questions.length - answeredCount;

//     if (
//       unanswered > 0 &&
//       !window.confirm(
//         `${unanswered} question(s) khali hain. Phir bhi submit karna hai?`
//       )
//     ) {
//       return;
//     }

//     // { questionId: "selected option ya likha hua answer" }
//     // Khali answers "" ke roop me jayenge.
//     const payload = Object.fromEntries(
//       questions.map((question) => {
//         const value = answers[question.id];
//         return [question.id, value == null ? "" : String(value).trim()];
//       })
//     );

//     setLoading(true);
//     setError("");

//     try {
//       const data = await api.submitQuiz(quizId, payload);
//       setResult(data);
//       setSubmitted(true);
//     } catch (err) {
//       setError(err.message || "Quiz evaluate nahi ho paya.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   // ---- Questions ko sections me baanto ----
//   const mcqQuestions = questions.filter((question) => question.type === "mcq");
//   const writtenQuestions = questions.filter(
//     (question) => question.type !== "mcq"
//   );
//   const writtenHint = WRITTEN_HINTS[writtenQuestions[0]?.type] || "";

//   // ---- Result ko screen ke hisaab se tayyar karo ----
//   const reviews = Array.isArray(result?.results) ? result.results : [];
//   const reviewById = Object.fromEntries(
//     reviews.map((review) => [String(review.questionId ?? review.id), review])
//   );

//   const counts = { correct: 0, partial: 0, wrong: 0 };
//   questions.forEach((question) => {
//     const verdict = getVerdict(reviewById[String(question.id)]);
//     if (verdict) counts[verdict] += 1;
//   });
//   const hasVerdicts = counts.correct + counts.partial + counts.wrong > 0;

//   function sectionPoints(list) {
//     return list.reduce((sum, question) => {
//       const verdict = getVerdict(reviewById[String(question.id)]);
//       if (verdict === "correct") return sum + 1;
//       if (verdict === "partial") return sum + 0.5;
//       return sum;
//     }, 0);
//   }

//   // Backend score (percentage) de to wahi, warna verdicts se nikal lo.
//   const score =
//     result?.score ??
//     result?.percentage ??
//     (hasVerdicts && questions.length
//       ? Math.round(
//           ((counts.correct + counts.partial * 0.5) / questions.length) * 100
//         )
//       : null);

//   const suggestions = toList(result?.suggestions);

//   function renderQuestion(question, number) {
//     const review = reviewById[String(question.id)];
//     const verdict = getVerdict(review);
//     const verdictStyle = verdict ? VERDICT_STYLES[verdict] : null;
//     const VerdictIcon = verdictStyle?.icon;
//     const meta = TYPE_META[question.type];
//     const TypeIcon = meta.icon;
//     const isMcq = question.type === "mcq";
//     const input = WRITTEN_INPUT[question.type];
//     const rawAnswer = answers[question.id];
//     const answerText = rawAnswer == null ? "" : String(rawAnswer);
//     const correctAnswer = review?.correctAnswer;
//     const optionMatched =
//       isMcq &&
//       question.options.some((option) => matchesCorrect(option, correctAnswer));

//     return (
//       <section
//         key={question.id}
//         className={`panel space-y-4 p-5 ${
//           verdictStyle ? `border ${verdictStyle.border}` : ""
//         }`}
//       >
//         <div className="flex flex-wrap items-center justify-between gap-2">
//           <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">
//             Question {number} of {questions.length}
//           </p>

//           <div className="flex flex-wrap items-center gap-2">
//             <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
//               <TypeIcon size={13} />
//               {meta.label}
//             </span>

//             {verdictStyle && (
//               <span
//                 className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs ${verdictStyle.badge}`}
//               >
//                 <VerdictIcon size={13} />
//                 {verdictStyle.label}
//               </span>
//             )}
//           </div>
//         </div>

//         <h3 className="whitespace-pre-wrap break-words font-semibold leading-6 text-white">
//           {question.question}
//         </h3>

//         {question.type === "coding" && question.language && (
//           <p className="text-xs text-slate-400">
//             Write your solution in {question.language}.
//           </p>
//         )}

//         {/* ---------- Single select ---------- */}
//         {isMcq && (
//           <div className="space-y-2">
//             {question.options.map((option) => {
//               const { value, label } = optionParts(option);
//               const selected = answers[question.id] === value;
//               const isCorrectOption =
//                 submitted && matchesCorrect(option, correctAnswer);

//               let tone = "idle";

//               if (submitted) {
//                 if (isCorrectOption) {
//                   tone = "correct";
//                 } else if (selected) {
//                   tone =
//                     verdict === "correct"
//                       ? "correct"
//                       : verdict === "wrong"
//                         ? "wrong"
//                         : "selected";
//                 }
//               } else if (selected) {
//                 tone = "selected";
//               }

//               const tags = [
//                 selected && "Your answer",
//                 isCorrectOption && "Correct answer",
//               ].filter(Boolean);

//               return (
//                 <label
//                   key={String(value)}
//                   className={`flex items-center gap-3 rounded-xl border p-3 text-sm ${
//                     OPTION_TONES[tone]
//                   } ${
//                     submitted
//                       ? ""
//                       : tone === "idle"
//                         ? "cursor-pointer hover:bg-slate-800/60"
//                         : "cursor-pointer"
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     name={String(question.id)}
//                     value={value}
//                     checked={selected}
//                     disabled={submitted || loading}
//                     onChange={() => setAnswer(question.id, value)}
//                     className="accent-violet-500"
//                   />

//                   <span className="min-w-0 flex-1 whitespace-pre-wrap break-words">
//                     {label}
//                   </span>

//                   {submitted && tags.length > 0 && (
//                     <span className="shrink-0 text-xs text-slate-300">
//                       {tags.join(" / ")}
//                     </span>
//                   )}
//                 </label>
//               );
//             })}
//           </div>
//         )}

//         {/* ---------- Written answer box ---------- */}
//         {!isMcq && !submitted && (
//           <textarea
//             value={answerText}
//             onChange={(event) => setAnswer(question.id, event.target.value)}
//             rows={input.rows}
//             maxLength={input.maxLength}
//             spellCheck={!input.mono}
//             disabled={loading}
//             aria-label={`Answer for question ${number}`}
//             placeholder={input.placeholder}
//             className={`input-field h-auto w-full resize-y ${
//               input.mono ? "font-mono text-sm leading-6" : "leading-7"
//             }`}
//           />
//         )}

//         {/* ---------- Review (submit ke baad) ---------- */}
//         {submitted && (
//           <div className="space-y-4">
//             {!isMcq && (
//               <div>
//                 <p className="mb-1 text-xs font-semibold text-slate-400">
//                   Your answer
//                 </p>

//                 {answerText.trim() ? (
//                   <pre
//                     className={`rounded-xl border border-slate-800 bg-[#080b14] p-3 text-sm text-slate-200 ${
//                       input.mono
//                         ? "overflow-x-auto whitespace-pre font-mono leading-6"
//                         : "whitespace-pre-wrap break-words font-sans leading-7"
//                     }`}
//                   >
//                     {answerText}
//                   </pre>
//                 ) : (
//                   <p className="text-sm italic text-slate-500">
//                     Answer nahi likha.
//                   </p>
//                 )}
//               </div>
//             )}

//             {isMcq && !answerText && (
//               <p className="text-sm italic text-slate-500">
//                 Koi option select nahi kiya.
//               </p>
//             )}

//             {review?.feedback && (
//               <div>
//                 <p className="mb-1 text-xs font-semibold text-slate-400">
//                   Feedback
//                 </p>
//                 <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">
//                   {review.feedback}
//                 </p>
//               </div>
//             )}

//             {verdict !== "correct" && review?.explanation && (
//               <div className="rounded-xl border border-slate-800 bg-[#080b14] p-4">
//                 <p className="mb-1 text-xs font-semibold text-amber-300">
//                   Explanation
//                 </p>
//                 <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">
//                   {review.explanation}
//                 </p>
//               </div>
//             )}

//             {verdict !== "correct" &&
//               correctAnswer &&
//               !(isMcq && optionMatched) && (
//                 <div>
//                   <p className="mb-1 text-xs font-semibold text-emerald-300">
//                     Correct answer
//                   </p>
//                   <pre
//                     className={`rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-slate-200 ${
//                       input?.mono
//                         ? "overflow-x-auto whitespace-pre font-mono leading-6"
//                         : "whitespace-pre-wrap break-words font-sans leading-7"
//                     }`}
//                   >
//                     {correctAnswer}
//                   </pre>
//                 </div>
//               )}
//           </div>
//         )}
//       </section>
//     );
//   }

//   return (
//     <div className="mx-auto max-w-4xl space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-white md:text-3xl">
//           Practice Quiz
//         </h1>
//         <p className="mt-2 text-slate-400">
//           Generate AI questions, answer them and get detailed feedback.
//         </p>
//       </div>

//       <form
//         onSubmit={generateQuiz}
//         className="panel flex flex-col gap-3 p-5 sm:flex-row"
//       >
//         <input
//           className="input-field flex-1"
//           value={topic}
//           onChange={(event) => setTopic(event.target.value)}
//           placeholder="Enter a topic, e.g. JavaScript closures"
//           required
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="primary-btn disabled:opacity-50"
//         >
//           <Sparkles size={18} />
//           {loading && !questions.length ? "Please wait..." : "Generate AI Quiz"}
//         </button>
//       </form>

//       {error && (
//         <p
//           role="alert"
//           className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300"
//         >
//           {error}
//         </p>
//       )}

//       {!questions.length && (
//         <div className="panel p-10 text-center">
//           <BrainCircuit className="mx-auto text-violet-300" size={40} />
//           <p className="mt-3 font-semibold text-white">Your quiz starts here</p>
//           <p className="mt-2 text-sm text-slate-400">
//             Enter a topic to get {TOTAL_QUESTIONS} questions: {MCQ_COUNT} single
//             select and {WRITTEN_COUNT} written. Coding topics get code-writing
//             problems and math topics get problems to solve.
//           </p>
//         </div>
//       )}

//       {/* Summary: score + feedback + suggestions */}
//       {result && (
//         <div ref={resultRef} className="panel scroll-mt-4 space-y-5 p-6">
//           <div className="flex flex-wrap items-start justify-between gap-4">
//             <div className="min-w-0 flex-1">
//               <h2 className="text-xl font-bold text-white">Quiz results</h2>
//               <p className="mt-2 whitespace-pre-wrap text-slate-300">
//                 {result.feedback || result.message || "Evaluation completed."}
//               </p>
//             </div>

//             <p className="text-4xl font-bold text-violet-300">
//               {score != null ? `${score}%` : "—"}
//             </p>
//           </div>

//           {hasVerdicts && (
//             <div className="grid grid-cols-2 gap-3 text-sm">
//               {mcqQuestions.length > 0 && (
//                 <div className="rounded-xl border border-slate-800 bg-[#080b14] p-3">
//                   <p className="text-slate-400">Single select</p>
//                   <p className="mt-1 text-lg font-semibold text-white">
//                     {formatPoints(sectionPoints(mcqQuestions))} /{" "}
//                     {mcqQuestions.length}
//                   </p>
//                 </div>
//               )}

//               {writtenQuestions.length > 0 && (
//                 <div className="rounded-xl border border-slate-800 bg-[#080b14] p-3">
//                   <p className="text-slate-400">Written</p>
//                   <p className="mt-1 text-lg font-semibold text-white">
//                     {formatPoints(sectionPoints(writtenQuestions))} /{" "}
//                     {writtenQuestions.length}
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}

//           {hasVerdicts && (
//             <div className="flex flex-wrap gap-2 text-xs">
//               {Object.entries(VERDICT_STYLES).map(([key, style]) => {
//                 const Icon = style.icon;

//                 return (
//                   <span
//                     key={key}
//                     className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 ${style.badge}`}
//                   >
//                     <Icon size={13} />
//                     {counts[key]} {style.label.toLowerCase()}
//                   </span>
//                 );
//               })}
//             </div>
//           )}

//           {suggestions.length > 0 && (
//             <div className="rounded-xl border border-slate-800 bg-[#080b14] p-4">
//               <p className="flex items-center gap-2 font-semibold text-white">
//                 <Lightbulb size={18} className="text-amber-300" />
//                 Suggestions to improve
//               </p>

//               <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
//                 {suggestions.map((suggestion, index) => (
//                   <li key={index}>{suggestion}</li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           <p className="text-sm text-slate-400">
//             Neeche har question ka review hai. Galat ya adhoore answers ka
//             explanation aur sahi answer bhi diya gaya hai.
//           </p>
//         </div>
//       )}

//       {/* Section 1: Single select */}
//       {mcqQuestions.length > 0 && (
//         <div className="space-y-4">
//           <SectionHeading
//             title={`Section 1: Single select (${mcqQuestions.length})`}
//             hint="Har question ka ek sahi option chuno."
//           />
//           {mcqQuestions.map((question, index) =>
//             renderQuestion(question, index + 1)
//           )}
//         </div>
//       )}

//       {/* Section 2: Written */}
//       {writtenQuestions.length > 0 && (
//         <div className="space-y-4">
//           <SectionHeading
//             title={`Section 2: Written (${writtenQuestions.length})`}
//             hint={writtenHint}
//           />
//           {writtenQuestions.map((question, index) =>
//             renderQuestion(question, mcqQuestions.length + index + 1)
//           )}
//         </div>
//       )}

//       {/* Submit: sabse last me */}
//       {questions.length > 0 && !submitted && (
//         <div className="space-y-3">
//           <div className="flex flex-wrap items-center gap-4">
//             <button
//               type="button"
//               className="primary-btn disabled:cursor-not-allowed disabled:opacity-50"
//               disabled={loading || !quizId || answeredCount === 0}
//               onClick={submitQuiz}
//             >
//               {loading ? (
//                 <LoaderCircle size={18} className="animate-spin" />
//               ) : (
//                 <CheckCircle2 size={18} />
//               )}
//               {loading ? "Evaluating answers..." : "Submit answers"}
//             </button>

//             <p className="text-sm text-slate-400">
//               {answeredCount} of {questions.length} answered
//             </p>
//           </div>

//           {loading && (
//             <p className="text-sm text-slate-400">
//               AI tumhare written answers check kar raha hai, thoda time lag
//               sakta hai.
//             </p>
//           )}
//         </div>
//       )}

//       {submitted && (
//         <button type="button" onClick={resetQuiz} className="secondary-btn">
//           Generate another quiz
//         </button>
//       )}
//     </div>
//   );
// }





import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  BrainCircuit,
  Calculator,
  CheckCircle2,
  Code,
  Lightbulb,
  ListChecks,
  LoaderCircle,
  Sparkles,
  XCircle,
} from "lucide-react";
import { api } from "../services/api";

// Total 10 questions: pehle 5 single-select, phir 5 written.
// Written 5 ka mix topic se decide hota hai (backend karta hai):
//   coding topic -> 3 theory + 2 coding (program likhna),
//   math topic   -> 3 theory + 2 problems solve karne wali,
//   baaki topics -> 5 theory.
const MCQ_COUNT = 5;
const WRITTEN_COUNT = 5;
const TOTAL_QUESTIONS = MCQ_COUNT + WRITTEN_COUNT;

const VERDICT_STYLES = {
  correct: {
    label: "Correct",
    icon: CheckCircle2,
    badge: "bg-emerald-500/10 text-emerald-300",
    border: "border-emerald-500/40",
  },
  partial: {
    label: "Partially correct",
    icon: AlertCircle,
    badge: "bg-amber-500/10 text-amber-300",
    border: "border-amber-500/40",
  },
  wrong: {
    label: "Needs improvement",
    icon: XCircle,
    badge: "bg-red-500/10 text-red-300",
    border: "border-red-500/40",
  },
};

const TYPE_META = {
  mcq: { label: "Single select", icon: ListChecks },
  theory: { label: "Theory", icon: BookOpen },
  coding: { label: "Coding", icon: Code },
  math: { label: "Math", icon: Calculator },
};

// Written questions ke answer box ki settings.
const WRITTEN_INPUT = {
  theory: {
    rows: 5,
    maxLength: 1500,
    mono: false,
    placeholder: "Apna answer apne words mein likho...",
  },
  coding: {
    rows: 10,
    maxLength: 4000,
    mono: true,
    placeholder: "Apna code yahan likho...",
  },
  math: {
    rows: 7,
    maxLength: 2000,
    mono: false,
    placeholder: "Steps likho aur last me final answer likho...",
  },
};

const WRITTEN_HINTS = {
  theory: "Theory: apne words me answer likho.",
  coding: "Coding: poora program likho (code box me type karo).",
  math: "Math: problem solve karo, steps aur final answer likho.",
};

const OPTION_TONES = {
  idle: "border-slate-800 text-slate-300",
  selected: "border-violet-500 bg-violet-500/10 text-white",
  correct: "border-emerald-500 bg-emerald-500/10 text-white",
  wrong: "border-red-500 bg-red-500/10 text-white",
};

function getVerdict(review) {
  if (!review) return null;
  if (VERDICT_STYLES[review.verdict]) return review.verdict;
  if (typeof review.isCorrect === "boolean") {
    return review.isCorrect ? "correct" : "wrong";
  }
  return null;
}

function toList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return value ? [value] : [];
}

function optionParts(option) {
  if (typeof option === "string") return { value: option, label: option };
  return { value: option.value, label: option.label ?? option.value };
}

const norm = (value) => String(value ?? "").trim().toLowerCase();

function matchesCorrect(option, correctAnswer, options = []) {
  if (correctAnswer == null || String(correctAnswer).trim() === "") {
    return false;
  }

  const target = norm(correctAnswer);
  const { value, label } = optionParts(option);

  if (target === norm(value) || target === norm(label)) return true;

  // Agar kisi option se text match hua hi nahi, to "B" / "Option B" jaise
  // letter ko index maan lo.
  const textMatchesSomeOption = options.some((item) => {
    const parts = optionParts(item);
    return norm(parts.value) === target || norm(parts.label) === target;
  });

  if (textMatchesSomeOption) return false;

  const letter = /^(?:option\s*)?([a-f])[).:]?$/i.exec(
    String(correctAnswer).trim()
  );

  return letter
    ? options[letter[1].toUpperCase().charCodeAt(0) - 65] === option
    : false;
}

// Backend ka verdict ho to wahi; warna MCQ me sahi option se khud nikal lo.
function resolveVerdict(question, review, answerValue) {
  const fromBackend = getVerdict(review);
  if (fromBackend) return fromBackend;

  if (question.type === "mcq" && review?.correctAnswer != null) {
    const picked = (question.options || []).find(
      (option) => optionParts(option).value === answerValue
    );

    return picked &&
      matchesCorrect(picked, review.correctAnswer, question.options)
      ? "correct"
      : "wrong";
  }

  return null;
}

function normalizeType(question) {
  if (Array.isArray(question.options) && question.options.length) return "mcq";
  if (question.type === "coding" || question.type === "math") {
    return question.type;
  }
  return "theory";
}

function formatPoints(points) {
  return Number.isInteger(points) ? String(points) : points.toFixed(1);
}

function SectionHeading({ title, hint }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-white">{title}</h2>
      {hint && <p className="mt-1 text-sm text-slate-400">{hint}</p>}
    </div>
  );
}

export default function Quiz() {
  const [topic, setTopic] = useState("Java LinkedList");
  const [quizId, setQuizId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const resultRef = useRef(null);

  // Result aate hi summary (score, feedback, suggestions) tak scroll karo.
  useEffect(() => {
    if (result) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  function setAnswer(questionId, value) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  }

  function resetQuiz() {
    setQuestions([]);
    setAnswers({});
    setQuizId("");
    setResult(null);
    setSubmitted(false);
    setError("");
  }

  async function generateQuiz(event) {
    event.preventDefault();

    setLoading(true);
    resetQuiz();

    try {
      const data = await api.generateQuiz(topic.trim(), TOTAL_QUESTIONS);

      if (!data.quizId) {
        throw new Error("Backend response mein quizId nahi mila.");
      }

      if (!Array.isArray(data.questions) || !data.questions.length) {
        throw new Error("Backend ne valid questions return nahi kiye.");
      }

      setQuizId(data.quizId);
      setQuestions(
        data.questions.map((question, index) => ({
          ...question,
          id: question.id ?? `q${index + 1}`,
          type: normalizeType(question),
        }))
      );
    } catch (err) {
      setError(err.message || "Quiz generate nahi ho paya.");
    } finally {
      setLoading(false);
    }
  }

  function isAnswered(question) {
    const value = answers[question.id];
    return value != null && String(value).trim() !== "";
  }

  const answeredCount = questions.filter(isAnswered).length;

  async function submitQuiz() {
    if (!quizId) {
      setError("Quiz ID missing hai. Naya quiz generate karo.");
      return;
    }

    if (answeredCount === 0) {
      setError("Submit karne se pehle kam se kam ek answer do.");
      return;
    }

    const unanswered = questions.length - answeredCount;

    if (
      unanswered > 0 &&
      !window.confirm(
        `${unanswered} question(s) khali hain. Phir bhi submit karna hai?`
      )
    ) {
      return;
    }

    // { questionId: "selected option ya likha hua answer" }
    // Khali answers "" ke roop me jayenge.
    const payload = Object.fromEntries(
      questions.map((question) => {
        const value = answers[question.id];
        return [question.id, value == null ? "" : String(value).trim()];
      })
    );

    setLoading(true);
    setError("");

    try {
      const data = await api.submitQuiz(quizId, payload);
      setResult(data);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Quiz evaluate nahi ho paya.");
    } finally {
      setLoading(false);
    }
  }

  // ---- Questions ko sections me baanto ----
  const mcqQuestions = questions.filter((question) => question.type === "mcq");
  const writtenQuestions = questions.filter(
    (question) => question.type !== "mcq"
  );
  const writtenHint = ["theory", "coding", "math"]
    .filter((type) =>
      writtenQuestions.some((question) => question.type === type)
    )
    .map((type) => WRITTEN_HINTS[type])
    .join(" ");

  // ---- Result ko screen ke hisaab se tayyar karo ----
  const reviews = Array.isArray(result?.results) ? result.results : [];
  const reviewById = Object.fromEntries(
    reviews.map((review) => [String(review.questionId ?? review.id), review])
  );

  function verdictFor(question) {
    return resolveVerdict(
      question,
      reviewById[String(question.id)],
      answers[question.id]
    );
  }

  const counts = { correct: 0, partial: 0, wrong: 0 };
  questions.forEach((question) => {
    const verdict = verdictFor(question);
    if (verdict) counts[verdict] += 1;
  });
  const hasVerdicts = counts.correct + counts.partial + counts.wrong > 0;

  function sectionPoints(list) {
    return list.reduce((sum, question) => {
      const verdict = verdictFor(question);
      if (verdict === "correct") return sum + 1;
      if (verdict === "partial") return sum + 0.5;
      return sum;
    }, 0);
  }

  // Backend score (percentage) de to wahi, warna verdicts se nikal lo.
  const score =
    result?.score ??
    result?.percentage ??
    (hasVerdicts && questions.length
      ? Math.round(
          ((counts.correct + counts.partial * 0.5) / questions.length) * 100
        )
      : null);

  const suggestions = toList(result?.suggestions);

  function renderQuestion(question, number) {
    const review = reviewById[String(question.id)];
    const verdict = verdictFor(question);
    const verdictStyle = verdict ? VERDICT_STYLES[verdict] : null;
    const VerdictIcon = verdictStyle?.icon;
    const meta = TYPE_META[question.type];
    const TypeIcon = meta.icon;
    const isMcq = question.type === "mcq";
    const input = WRITTEN_INPUT[question.type];
    const rawAnswer = answers[question.id];
    const answerText = rawAnswer == null ? "" : String(rawAnswer);
    const correctAnswer = review?.correctAnswer;
    const optionMatched =
      isMcq &&
      question.options.some((option) =>
        matchesCorrect(option, correctAnswer, question.options)
      );

    return (
      <section
        key={question.id}
        className={`panel space-y-4 p-5 ${
          verdictStyle ? `border ${verdictStyle.border}` : ""
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">
            Question {number} of {questions.length}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
              <TypeIcon size={13} />
              {meta.label}
            </span>

            {verdictStyle && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs ${verdictStyle.badge}`}
              >
                <VerdictIcon size={13} />
                {verdictStyle.label}
              </span>
            )}
          </div>
        </div>

        <h3 className="whitespace-pre-wrap break-words font-semibold leading-6 text-white">
          {question.question}
        </h3>

        {question.type === "coding" && question.language && (
          <p className="text-xs text-slate-400">
            Write your solution in {question.language}.
          </p>
        )}

        {/* ---------- Single select ---------- */}
        {isMcq && (
          <div className="space-y-2">
            {question.options.map((option) => {
              const { value, label } = optionParts(option);
              const selected = answers[question.id] === value;
              const isCorrectOption =
                submitted &&
                matchesCorrect(option, correctAnswer, question.options);

              let tone = "idle";

              if (submitted) {
                if (isCorrectOption) {
                  tone = "correct";
                } else if (selected) {
                  tone =
                    verdict === "correct"
                      ? "correct"
                      : verdict === "wrong"
                        ? "wrong"
                        : "selected";
                }
              } else if (selected) {
                tone = "selected";
              }

              const tags = [
                selected && "Your answer",
                isCorrectOption && "Correct answer",
              ].filter(Boolean);

              return (
                <label
                  key={String(value)}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-sm ${
                    OPTION_TONES[tone]
                  } ${
                    submitted
                      ? ""
                      : tone === "idle"
                        ? "cursor-pointer hover:bg-slate-800/60"
                        : "cursor-pointer"
                  }`}
                >
                  <input
                    type="radio"
                    name={String(question.id)}
                    value={value}
                    checked={selected}
                    disabled={submitted || loading}
                    onChange={() => setAnswer(question.id, value)}
                    className="accent-violet-500"
                  />

                  <span className="min-w-0 flex-1 whitespace-pre-wrap break-words">
                    {label}
                  </span>

                  {submitted && tags.length > 0 && (
                    <span className="shrink-0 text-xs text-slate-300">
                      {tags.join(" / ")}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        )}

        {/* ---------- Written answer box ---------- */}
        {!isMcq && !submitted && (
          <textarea
            value={answerText}
            onChange={(event) => setAnswer(question.id, event.target.value)}
            rows={input.rows}
            maxLength={input.maxLength}
            spellCheck={!input.mono}
            disabled={loading}
            aria-label={`Answer for question ${number}`}
            placeholder={input.placeholder}
            className={`input-field h-auto w-full resize-y ${
              input.mono ? "font-mono text-sm leading-6" : "leading-7"
            }`}
          />
        )}

        {/* ---------- Review (submit ke baad) ---------- */}
        {submitted && (
          <div className="space-y-4">
            {!isMcq && (
              <div>
                <p className="mb-1 text-xs font-semibold text-slate-400">
                  Your answer
                </p>

                {answerText.trim() ? (
                  <pre
                    className={`rounded-xl border border-slate-800 bg-[#080b14] p-3 text-sm text-slate-200 ${
                      input.mono
                        ? "overflow-x-auto whitespace-pre font-mono leading-6"
                        : "whitespace-pre-wrap break-words font-sans leading-7"
                    }`}
                  >
                    {answerText}
                  </pre>
                ) : (
                  <p className="text-sm italic text-slate-500">
                    Answer nahi likha.
                  </p>
                )}
              </div>
            )}

            {isMcq && !answerText && (
              <p className="text-sm italic text-slate-500">
                Koi option select nahi kiya.
              </p>
            )}

            {review?.feedback && (
              <div>
                <p className="mb-1 text-xs font-semibold text-slate-400">
                  Feedback
                </p>
                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">
                  {review.feedback}
                </p>
              </div>
            )}

            {verdict !== "correct" && review?.explanation && (
              <div className="rounded-xl border border-slate-800 bg-[#080b14] p-4">
                <p className="mb-1 text-xs font-semibold text-amber-300">
                  Explanation
                </p>
                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">
                  {review.explanation}
                </p>
              </div>
            )}

            {verdict !== "correct" &&
              correctAnswer &&
              !(isMcq && optionMatched) && (
                <div>
                  <p className="mb-1 text-xs font-semibold text-emerald-300">
                    Correct answer
                  </p>
                  <pre
                    className={`rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-slate-200 ${
                      input?.mono
                        ? "overflow-x-auto whitespace-pre font-mono leading-6"
                        : "whitespace-pre-wrap break-words font-sans leading-7"
                    }`}
                  >
                    {correctAnswer}
                  </pre>
                </div>
              )}
          </div>
        )}
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">
          Practice Quiz
        </h1>
        <p className="mt-2 text-slate-400">
          Generate AI questions, answer them and get detailed feedback.
        </p>
      </div>

      <form
        onSubmit={generateQuiz}
        className="panel flex flex-col gap-3 p-5 sm:flex-row"
      >
        <input
          className="input-field flex-1"
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          placeholder="Enter a topic, e.g. JavaScript closures"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="primary-btn disabled:opacity-50"
        >
          <Sparkles size={18} />
          {loading && !questions.length ? "Please wait..." : "Generate AI Quiz"}
        </button>
      </form>

      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300"
        >
          {error}
        </p>
      )}

      {!questions.length && (
        <div className="panel p-10 text-center">
          <BrainCircuit className="mx-auto text-violet-300" size={40} />
          <p className="mt-3 font-semibold text-white">Your quiz starts here</p>
          <p className="mt-2 text-sm text-slate-400">
            Enter a topic to get {TOTAL_QUESTIONS} questions: {MCQ_COUNT} single
            select and {WRITTEN_COUNT} written. Coding topics include 2
            programs to write and math topics include 2 problems to solve.
          </p>
        </div>
      )}

      {/* Summary: score + feedback + suggestions */}
      {result && (
        <div ref={resultRef} className="panel scroll-mt-4 space-y-5 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold text-white">Quiz results</h2>
              <p className="mt-2 whitespace-pre-wrap text-slate-300">
                {result.feedback || result.message || "Evaluation completed."}
              </p>
            </div>

            <p className="text-4xl font-bold text-violet-300">
              {score != null ? `${score}%` : "—"}
            </p>
          </div>

          {hasVerdicts && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              {mcqQuestions.length > 0 && (
                <div className="rounded-xl border border-slate-800 bg-[#080b14] p-3">
                  <p className="text-slate-400">Single select</p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {formatPoints(sectionPoints(mcqQuestions))} /{" "}
                    {mcqQuestions.length}
                  </p>
                </div>
              )}

              {writtenQuestions.length > 0 && (
                <div className="rounded-xl border border-slate-800 bg-[#080b14] p-3">
                  <p className="text-slate-400">Written</p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {formatPoints(sectionPoints(writtenQuestions))} /{" "}
                    {writtenQuestions.length}
                  </p>
                </div>
              )}
            </div>
          )}

          {hasVerdicts && (
            <div className="flex flex-wrap gap-2 text-xs">
              {Object.entries(VERDICT_STYLES).map(([key, style]) => {
                const Icon = style.icon;

                return (
                  <span
                    key={key}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 ${style.badge}`}
                  >
                    <Icon size={13} />
                    {counts[key]} {style.label.toLowerCase()}
                  </span>
                );
              })}
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="rounded-xl border border-slate-800 bg-[#080b14] p-4">
              <p className="flex items-center gap-2 font-semibold text-white">
                <Lightbulb size={18} className="text-amber-300" />
                Suggestions to improve
              </p>

              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
                {suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-sm text-slate-400">
            Neeche har question ka review hai. Galat ya adhoore answers ka
            explanation aur sahi answer bhi diya gaya hai.
          </p>
        </div>
      )}

      {/* Section 1: Single select */}
      {mcqQuestions.length > 0 && (
        <div className="space-y-4">
          <SectionHeading
            title={`Section 1: Single select (${mcqQuestions.length})`}
            hint="Har question ka ek sahi option chuno."
          />
          {mcqQuestions.map((question, index) =>
            renderQuestion(question, index + 1)
          )}
        </div>
      )}

      {/* Section 2: Written */}
      {writtenQuestions.length > 0 && (
        <div className="space-y-4">
          <SectionHeading
            title={`Section 2: Written (${writtenQuestions.length})`}
            hint={writtenHint}
          />
          {writtenQuestions.map((question, index) =>
            renderQuestion(question, mcqQuestions.length + index + 1)
          )}
        </div>
      )}

      {/* Submit: sabse last me */}
      {questions.length > 0 && !submitted && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              className="primary-btn disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading || !quizId || answeredCount === 0}
              onClick={submitQuiz}
            >
              {loading ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <CheckCircle2 size={18} />
              )}
              {loading ? "Evaluating answers..." : "Submit answers"}
            </button>

            <p className="text-sm text-slate-400">
              {answeredCount} of {questions.length} answered
            </p>
          </div>

          {loading && (
            <p className="text-sm text-slate-400">
              AI tumhare written answers check kar raha hai, thoda time lag
              sakta hai.
            </p>
          )}
        </div>
      )}

      {submitted && (
        <button type="button" onClick={resetQuiz} className="secondary-btn">
          Generate another quiz
        </button>
      )}
    </div>
  );
}

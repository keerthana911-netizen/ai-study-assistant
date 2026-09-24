"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  MessageSquare,
  FileText,
  HelpCircle,
  Calendar,
  Check,
  X,
} from "lucide-react";
import FormattedContent from "@/components/FormattedContent";

type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
type Tab = "explain" | "notes" | "quiz" | "plan";

type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

const tabConfig: { id: Tab; label: string; icon: typeof MessageSquare }[] = [
  { id: "explain", label: "Explain", icon: MessageSquare },
  { id: "notes", label: "Study Notes", icon: FileText },
  { id: "quiz", label: "Quiz", icon: HelpCircle },
  { id: "plan", label: "Study Plan", icon: Calendar },
];

export default function StudyPage() {
  const { status } = useSession();
  const router = useRouter();

  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("BEGINNER");
  const [activeTab, setActiveTab] = useState<Tab>("explain");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [explanation, setExplanation] = useState("");
  const [notes, setNotes] = useState("");
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [plan, setPlan] = useState("");
  const [chatSessionId, setChatSessionId] = useState<string | undefined>();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const handleGenerate = async (tab: Tab) => {
    if (!topic.trim()) {
      setError("Enter a topic first");
      return;
    }
    setError("");
    setLoading(true);
    setActiveTab(tab);
    setShowQuizResults(false);
    setSelectedAnswers({});

    try {
      const endpoint =
        tab === "explain"
          ? "/api/study/explain"
          : tab === "notes"
          ? "/api/study/notes"
          : tab === "quiz"
          ? "/api/study/quiz"
          : "/api/study/plan";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty, ...(tab === "explain" && chatSessionId ? { chatSessionId } : {}) }),
      });
      const data = await res.json().catch(() => ({ error: "The server returned an invalid response. Please try again." }));

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong");
      }

      if (tab === "explain") {
        setExplanation(data.explanation);
        setChatSessionId(data.chatSessionId);
      }
      if (tab === "notes") setNotes(data.content);
      if (tab === "quiz") setQuiz(data.questions);
      if (tab === "plan") setPlan(data.plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const score =
    quiz && showQuizResults
      ? quiz.filter((q, i) => selectedAnswers[i] === q.correctIndex).length
      : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      <header className="relative bg-white/[0.03] backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/dashboard" className="text-zinc-500 hover:text-white transition">
          <ArrowLeft size={20} />
        </Link>
        <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Sparkles className="text-white" size={16} />
        </div>
        <span className="font-bold text-white">Study Assistant</span>
        <button
          type="button"
          onClick={() => {
            setTopic("");
            setExplanation("");
            setNotes("");
            setQuiz(null);
            setPlan("");
            setChatSessionId(undefined);
            setError("");
          }}
          className="ml-auto text-sm text-zinc-400 hover:text-white transition"
        >
          New topic
        </button>
      </header>

      <main className="relative max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-2xl p-6 mb-6">
          <label className="block text-sm font-semibold text-zinc-300 mb-2">
            What do you want to study?
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Binary Search Trees, French Revolution, Newton's Laws"
            className="w-full border border-white/10 bg-white/5 rounded-xl px-4 py-3 mb-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
          />

          <div className="flex gap-2 mb-5">
            {(["BEGINNER", "INTERMEDIATE", "ADVANCED"] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  difficulty === d
                    ? "bg-white text-black"
                    : "bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10"
                }`}
              >
                {d.charAt(0) + d.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {tabConfig.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => handleGenerate(t.id)}
                  disabled={loading}
                  className="flex flex-col items-center gap-1.5 px-3 py-3 bg-violet-500/10 border border-violet-500/20 text-violet-300 rounded-xl text-sm font-semibold hover:bg-violet-500/20 disabled:opacity-50 transition"
                >
                  <Icon size={18} />
                  {t.label}
                </button>
              );
            })}
          </div>

          {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        </div>

        {loading && (
          <div className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-2xl p-10 text-center">
            <div className="inline-block w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mb-3" />
            <p className="text-zinc-400">Generating your {activeTab}...</p>
          </div>
        )}

        {!loading && activeTab === "explain" && explanation && (
          <div className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-2xl p-6">
            <FormattedContent content={explanation} />
          </div>
        )}

        {!loading && activeTab === "notes" && notes && (
          <div className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-2xl p-6">
            <FormattedContent content={notes} />
          </div>
        )}

        {!loading && activeTab === "plan" && plan && (
          <div className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-2xl p-6">
            <FormattedContent content={plan} />
          </div>
        )}

        {!loading && activeTab === "quiz" && quiz && (
          <div className="space-y-4">
            {showQuizResults && (
              <div className="bg-white text-black rounded-2xl p-5 text-center">
                <p className="text-3xl font-bold">
                  {score} / {quiz.length}
                </p>
                <p className="text-zinc-600 text-sm">correct</p>
              </div>
            )}

            {quiz.map((q, qi) => (
              <div key={qi} className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-2xl p-5">
                <p className="font-semibold text-white mb-3">
                  {qi + 1}. {q.question}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => {
                    const isSelected = selectedAnswers[qi] === oi;
                    const isCorrect = oi === q.correctIndex;
                    const showState = showQuizResults;
                    return (
                      <button
                        key={oi}
                        onClick={() =>
                          !showQuizResults &&
                          setSelectedAnswers((prev) => ({ ...prev, [qi]: oi }))
                        }
                        className={`w-full flex items-center justify-between text-left px-4 py-2.5 rounded-xl border text-sm transition ${
                          showState && isCorrect
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                            : showState && isSelected && !isCorrect
                            ? "border-red-500/40 bg-red-500/10 text-red-300"
                            : isSelected
                            ? "border-violet-500/40 bg-violet-500/10 text-violet-300"
                            : "border-white/10 text-zinc-300 hover:bg-white/5"
                        }`}
                      >
                        {opt}
                        {showState && isCorrect && <Check size={16} className="text-emerald-400" />}
                        {showState && isSelected && !isCorrect && (
                          <X size={16} className="text-red-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
                {showQuizResults && (
                  <p className="text-sm text-zinc-500 mt-3 italic border-t border-white/10 pt-3">
                    {q.explanation}
                  </p>
                )}
              </div>
            ))}
            {!showQuizResults && (
              <button
                onClick={() => setShowQuizResults(true)}
                className="w-full bg-white text-black rounded-xl py-3 font-semibold hover:bg-zinc-200 transition-all"
              >
                Check Answers
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

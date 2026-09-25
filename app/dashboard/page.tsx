"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Plus, FileText, HelpCircle, LogOut, Calendar, MessageSquare, ArrowRight } from "lucide-react";
import AuthSocialButtons from "@/components/AuthSocialButtons";

type Note = { id: string; topic: string; createdAt: string; difficulty: string };
type Quiz = { id: string; topic: string; createdAt: string; difficulty: string };
type StudyPlan = { id: string; topic: string; createdAt: string; difficulty: string };
type ChatSession = { id: string; topic: string; createdAt: string; difficulty: string; messages: { role: string; content: string }[] };

const difficultyColor: Record<string, string> = {
  BEGINNER: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  INTERMEDIATE: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  ADVANCED: "bg-red-500/10 text-red-400 border border-red-500/20",
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [history, setHistory] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      Promise.all([
        fetch("/api/study/notes").then((r) => r.json()),
        fetch("/api/study/quiz").then((r) => r.json()),
        fetch("/api/study/plan").then((r) => r.json()),
        fetch("/api/study/history").then((r) => r.json()),
      ]).then(([n, q, p, h]) => {
        setNotes(Array.isArray(n) ? n : []);
        setQuizzes(Array.isArray(q) ? q : []);
        setPlans(Array.isArray(p) ? p : []);
        setHistory(Array.isArray(h) ? h : []);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-zinc-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      <header className="relative bg-white/[0.03] backdrop-blur-xl border-b border-white/10 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="text-white" size={16} />
          </div>
          <span className="font-bold text-white">StudyAI</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-400 hidden sm:block">{session?.user?.name || session?.user?.email}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition"
          >
            <LogOut size={15} />
            Log out
          </button>
        </div>
      </header>

      <main className="relative max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-sm text-violet-300 mb-2">Your learning cockpit</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Keep your study streak moving.</h1>
          <p className="text-zinc-500 mt-2">Generate, review, and revisit everything you learn in one place.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-2xl p-5">
            <p className="text-3xl font-bold text-violet-400">{notes.length}</p>
            <p className="text-sm text-zinc-500">Notes generated</p>
          </div>
          <div className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-2xl p-5">
            <p className="text-3xl font-bold text-purple-400">{quizzes.length}</p>
            <p className="text-sm text-zinc-500">Quizzes taken</p>
          </div>
          <div className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-2xl p-5">
            <p className="text-3xl font-bold text-fuchsia-400">{plans.length}</p>
            <p className="text-sm text-zinc-500">Plans created</p>
          </div>
          <div className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-2xl p-5">
            <p className="text-3xl font-bold text-sky-400">{history.length}</p>
            <p className="text-sm text-zinc-500">Chat sessions</p>
          </div>
        </div>

        <Link
          href="/study"
          className="flex items-center justify-center gap-2 bg-white text-black rounded-2xl p-5 mb-8 font-semibold hover:bg-zinc-200 transition-all"
        >
          <Plus size={20} />
          Start a new study session
        </Link>

        <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 mb-8">
          <h2 className="text-lg font-bold text-white mb-1">Connect a sign-in method</h2>
          <p className="text-sm text-zinc-500 mb-4">
            You are signed in securely. Connect Google or GitHub now so you can use it next time without weakening account security.
          </p>
          <AuthSocialButtons />
        </section>

        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <FileText size={18} className="text-violet-400" />
          Your Notes
        </h2>
        {notes.length === 0 ? (
          <p className="text-zinc-500 text-sm mb-8">No notes yet — generate some above.</p>
        ) : (
          <div className="space-y-2 mb-8">
            {notes.map((n) => (
              <div
                key={n.id}
                className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 flex justify-between items-center hover:bg-white/[0.06] transition"
              >
                <span className="font-medium text-zinc-200">{n.topic}</span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${difficultyColor[n.difficulty]}`}>
                  {n.difficulty}
                </span>
              </div>
            ))}
          </div>
        )}

        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Calendar size={18} className="text-fuchsia-400" />
          Your Study Plans
        </h2>
        {plans.length === 0 ? (
          <p className="text-zinc-500 text-sm mb-8">No study plans yet — make one from the study workspace.</p>
        ) : (
          <div className="space-y-2 mb-8">
            {plans.slice(0, 4).map((p) => (
              <div key={p.id} className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 flex justify-between items-center hover:bg-white/[0.06] transition">
                <div><p className="font-medium text-zinc-200">{p.topic}</p><p className="text-xs text-zinc-600">{new Date(p.createdAt).toLocaleDateString()}</p></div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${difficultyColor[p.difficulty]}`}>{p.difficulty}</span>
              </div>
            ))}
          </div>
        )}

        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <MessageSquare size={18} className="text-sky-400" />
          Recent Conversations
        </h2>
        {history.length === 0 ? (
          <p className="text-zinc-500 text-sm">Your explanations will appear here after your first study session.</p>
        ) : (
          <div className="space-y-2">
            {history.slice(0, 5).map((item) => (
              <div key={item.id} className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between gap-4">
                <div className="min-w-0"><p className="font-medium text-zinc-200 truncate">{item.topic}</p><p className="text-xs text-zinc-600">{new Date(item.createdAt).toLocaleDateString()} · {item.difficulty}</p></div>
                <ArrowRight size={16} className="text-zinc-600 shrink-0" />
              </div>
            ))}
          </div>
        )}

        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <HelpCircle size={18} className="text-purple-400" />
          Your Quizzes
        </h2>
        {quizzes.length === 0 ? (
          <p className="text-zinc-500 text-sm">No quizzes yet — generate some above.</p>
        ) : (
          <div className="space-y-2">
            {quizzes.map((q) => (
              <div
                key={q.id}
                className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 flex justify-between items-center hover:bg-white/[0.06] transition"
              >
                <span className="font-medium text-zinc-200">{q.topic}</span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${difficultyColor[q.difficulty]}`}>
                  {q.difficulty}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

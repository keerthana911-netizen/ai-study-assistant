import Link from "next/link";
import { Sparkles, BookOpen, Brain, Target, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden flex flex-col items-center justify-center px-4">
      {/* glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />

      <div className="relative max-w-2xl text-center">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-violet-300 px-4 py-1.5 rounded-full text-sm font-medium mb-8 backdrop-blur">
          <Sparkles size={14} />
          AI-Powered Learning
        </div>

        <h1 className="text-6xl font-bold text-white mb-5 tracking-tight leading-[1.05]">
          Study Smarter
          <br />
          with{" "}
          <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            AI
          </span>
        </h1>
        <p className="text-lg text-zinc-400 mb-10 max-w-md mx-auto">
          Instant explanations, notes, quizzes, and personalized study plans — for any topic, any level.
        </p>

        <div className="flex justify-center gap-3 mb-20">
          <Link
            href="/demo"
            className="group flex items-center gap-2 px-7 py-3 bg-white text-black rounded-full font-semibold hover:bg-zinc-200 transition-all"
          >
            Get Started for Free
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="px-7 py-3 bg-white/5 border border-white/10 text-white rounded-full font-semibold hover:bg-white/10 transition-all backdrop-blur"
          >
            Log In
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Link href="/demo#notes" className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-2xl p-5 hover:bg-white/[0.06] hover:border-violet-500/30 transition-all text-center">
            <div className="w-9 h-9 bg-violet-500/10 rounded-lg flex items-center justify-center mb-3 mx-auto">
              <BookOpen className="text-violet-400" size={18} />
            </div>
            <p className="font-medium text-zinc-200 text-sm">Instant Notes</p>
          </Link>
          <Link href="/demo#quizzes" className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-2xl p-5 hover:bg-white/[0.06] hover:border-violet-500/30 transition-all text-center">
            <div className="w-9 h-9 bg-violet-500/10 rounded-lg flex items-center justify-center mb-3 mx-auto">
              <Brain className="text-violet-400" size={18} />
            </div>
            <p className="font-medium text-zinc-200 text-sm">Smart Quizzes</p>
          </Link>
          <Link href="/demo#plans" className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-2xl p-5 hover:bg-white/[0.06] hover:border-violet-500/30 transition-all text-center">
            <div className="w-9 h-9 bg-violet-500/10 rounded-lg flex items-center justify-center mb-3 mx-auto">
              <Target className="text-violet-400" size={18} />
            </div>
            <p className="font-medium text-zinc-200 text-sm">Study Plans</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

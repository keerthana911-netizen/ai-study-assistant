import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Calendar,
  Check,
  History,
  LogIn,
  Search,
  Sparkles,
  UserPlus,
} from "lucide-react";

const steps = [
  { icon: UserPlus, number: "01", title: "Create your free account", text: "Use email and password, or continue with Google when OAuth credentials are enabled." },
  { icon: Search, number: "02", title: "Choose what to study", text: "Enter any topic, then select Beginner, Intermediate, or Advanced to match your level." },
  { icon: Sparkles, number: "03", title: "Generate and learn", text: "Ask for an explanation, notes, a quiz, or a personalized study plan in seconds." },
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />
      <header className="relative border-b border-white/10 bg-white/[0.03] backdrop-blur-xl px-5 sm:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold"><span className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center"><Sparkles size={16} /></span>StudyAI</Link>
        <div className="flex items-center gap-3"><Link href="/login" className="text-sm text-zinc-400 hover:text-white transition">Log in</Link><Link href="/signup" className="text-sm bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-zinc-200 transition">Get started</Link></div>
      </header>

      <main className="relative max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <section className="max-w-3xl">
          <p className="inline-flex items-center gap-2 text-sm text-violet-300 border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 rounded-full"><Sparkles size={14} /> A quick tour of StudyAI</p>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05] mt-6">Your personal study workspace, powered by AI.</h1>
          <p className="text-lg text-zinc-400 mt-6 max-w-2xl">Go from a blank page to a clear explanation, memorable notes, a graded quiz, and a plan you can actually follow.</p>
          <div className="flex flex-wrap gap-3 mt-8"><Link href="/signup" className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-zinc-200 transition">Create a free account <ArrowRight size={16} /></Link><Link href="/login" className="inline-flex items-center gap-2 border border-white/15 bg-white/5 px-6 py-3 rounded-full font-semibold hover:bg-white/10 transition"><LogIn size={16} /> Log in</Link></div>
          <p className="text-xs text-zinc-600 mt-4">No paid feature gate in this project. Usage depends on your configured Groq, database, and hosting free-tier limits.</p>
        </section>

        <section className="grid md:grid-cols-3 gap-4 mt-20">
          {steps.map((step) => { const Icon = step.icon; return <div key={step.number} className="bg-white/[0.04] border border-white/10 rounded-2xl p-6"><div className="flex items-center justify-between mb-6"><span className="text-xs text-violet-300 font-semibold tracking-widest">{step.number}</span><Icon className="text-violet-400" size={20} /></div><h2 className="font-semibold text-lg">{step.title}</h2><p className="text-sm text-zinc-500 mt-2 leading-relaxed">{step.text}</p></div>; })}
        </section>

        <section className="mt-20">
          <p className="text-sm text-violet-300 font-medium">Explore the toolkit</p>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2">Three ways to study smarter.</h2>
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <article id="notes" className="scroll-mt-8 bg-gradient-to-b from-violet-500/15 to-white/[0.03] border border-violet-400/20 rounded-2xl p-6"><BookOpen className="text-violet-300" size={24} /><h3 className="text-xl font-semibold mt-5">Instant Notes</h3><p className="text-sm text-zinc-400 mt-3 leading-relaxed">Turn a topic into concise, scannable study notes with headings, key concepts, and revision-friendly bullet points.</p><div className="flex items-center gap-2 text-xs text-violet-300 mt-6"><Check size={14} /> Saved to your dashboard</div></article>
            <article id="quizzes" className="scroll-mt-8 bg-gradient-to-b from-fuchsia-500/15 to-white/[0.03] border border-fuchsia-400/20 rounded-2xl p-6"><Brain className="text-fuchsia-300" size={24} /><h3 className="text-xl font-semibold mt-5">Smart Quizzes</h3><p className="text-sm text-zinc-400 mt-3 leading-relaxed">Practice with generated multiple-choice questions, select answers, reveal your score, and read explanations for every question.</p><div className="flex items-center gap-2 text-xs text-fuchsia-300 mt-6"><Check size={14} /> Instant feedback</div></article>
            <article id="plans" className="scroll-mt-8 bg-gradient-to-b from-sky-500/15 to-white/[0.03] border border-sky-400/20 rounded-2xl p-6"><Calendar className="text-sky-300" size={24} /><h3 className="text-xl font-semibold mt-5">Study Plans</h3><p className="text-sm text-zinc-400 mt-3 leading-relaxed">Get a day-by-day plan tailored to your topic and difficulty so you always know what to review next.</p><div className="flex items-center gap-2 text-xs text-sky-300 mt-6"><Check size={14} /> Stored for later</div></article>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6 mt-20">
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-7"><History className="text-emerald-300" size={22} /><h2 className="text-xl font-semibold mt-4">Your learning history stays organized</h2><p className="text-sm text-zinc-500 mt-3 leading-relaxed">The dashboard keeps generated notes, quizzes, plans, and explanation sessions tied to your account so you can return to them instead of starting over.</p></div>
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-7"><Sparkles className="text-amber-300" size={22} /><h2 className="text-xl font-semibold mt-4">Start in under a minute</h2><p className="text-sm text-zinc-500 mt-3 leading-relaxed">Create an account, enter a topic like “Binary Search Trees,” choose your level, and pick the learning mode that fits your next study block.</p></div>
        </section>
      </main>
    </div>
  );
}

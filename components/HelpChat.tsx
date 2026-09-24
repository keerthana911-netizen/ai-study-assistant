"use client";

import { FormEvent, useState } from "react";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";

type ChatMessage = { role: "assistant" | "user"; text: string };

const quickQuestions = ["How do I start?", "What can StudyAI do?", "Why did my AI request fail?"];

function getReply(question: string) {
  const value = question.toLowerCase();

  if (value.includes("start") || value.includes("use") || value.includes("work")) {
    return "Enter a topic in the study workspace, choose your difficulty, then select Explain, Study Notes, Quiz, or Study Plan. Your generated work is saved to the dashboard.";
  }
  if (value.includes("google") || value.includes("login") || value.includes("sign in")) {
    return "Use the Google button on the login page. Google OAuth must be configured with GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file.";
  }
  if (value.includes("quiz") || value.includes("question")) {
    return "Choose Quiz after entering a topic. Select one answer for each question, then press Check Answers to see your score and explanations.";
  }
  if (value.includes("note")) {
    return "Study Notes creates concise revision material with headings and key ideas. You can revisit generated notes from the dashboard.";
  }
  if (value.includes("plan")) {
    return "Study Plan creates a day-by-day plan based on your topic and difficulty, then saves it to your dashboard.";
  }
  if (value.includes("fail") || value.includes("error") || value.includes("quota") || value.includes("limit")) {
    return "If Groq shows a rate-limit error, wait a few seconds and try again. The free tier has token limits. Also check that GROQ_API_KEY is present in .env.";
  }
  return "I can help with starting a study session, login, notes, quizzes, study plans, and AI errors. Try one of the quick questions below.";
}

export default function HelpChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: "Hi! Need help using StudyAI? Ask me anything about the workspace." },
  ]);

  const ask = (question: string) => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;
    setMessages((current) => [
      ...current,
      { role: "user", text: cleanQuestion },
    ]);
    setInput("");
    window.setTimeout(() => {
      setMessages((current) => [...current, { role: "assistant", text: getReply(cleanQuestion) }]);
    }, 250);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    ask(input);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-violet-400/20 bg-[#12101b]/95 shadow-2xl shadow-violet-950/40 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 bg-violet-500/10 px-4 py-3">
            <div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600"><Sparkles size={16} /></span><div><p className="text-sm font-semibold text-white">StudyAI Help</p><p className="text-[11px] text-violet-200/70">Quick guidance, no extra quota</p></div></div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close help chat" className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white"><X size={17} /></button>
          </div>
          <div className="max-h-72 space-y-3 overflow-y-auto p-3">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <p className={`max-w-[88%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${message.role === "user" ? "rounded-br-sm bg-violet-600 text-white" : "rounded-bl-sm bg-white/10 text-zinc-200"}`}>{message.text}</p>
              </div>
            ))}
            {messages.length === 1 && <div className="flex flex-wrap gap-2">{quickQuestions.map((question) => <button key={question} type="button" onClick={() => ask(question)} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] text-zinc-300 hover:border-violet-400/40 hover:text-white">{question}</button>)}</div>}
          </div>
          <form onSubmit={submit} className="flex gap-2 border-t border-white/10 p-3"><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask for help..." aria-label="Ask StudyAI for help" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none placeholder:text-zinc-600 focus:border-violet-400/50" /><button type="submit" aria-label="Send help question" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-black hover:bg-zinc-200"><Send size={15} /></button></form>
        </div>
      )}
      <button type="button" onClick={() => setOpen((current) => !current)} aria-label={open ? "Close help chat" : "Open help chat"} className="ml-auto flex items-center gap-2 rounded-full border border-violet-400/30 bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/40 transition hover:scale-[1.02] hover:from-violet-500 hover:to-purple-500"><MessageCircle size={18} />{open ? "Close" : "Need help?"}</button>
    </div>
  );
}

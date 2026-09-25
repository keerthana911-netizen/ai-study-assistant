import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] px-6 py-16 text-zinc-200">
      <article className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-8">
        <Link href="/" className="text-sm text-violet-300 hover:text-violet-200">
          ← Back to StudyAI
        </Link>
        <h1 className="mt-8 text-3xl font-bold text-white">Privacy Policy</h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated: September 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-zinc-300">
          <section>
            <h2 className="text-lg font-semibold text-white">Information we use</h2>
            <p>
              StudyAI uses your name, email address, profile image, and sign-in provider details to create and secure your account. Study topics, generated notes, quizzes, plans, and chat history are stored so you can revisit your learning progress.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-white">How information is used</h2>
            <p>
              Your information is used to authenticate you, save your study history, and generate educational responses requested by you. We do not sell your personal information or use it for advertising.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-white">Third-party services</h2>
            <p>
              Google or GitHub may be used for sign-in when you choose those options. Groq processes prompts needed to generate study content. These services receive only the information required for their respective functions.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-white">Your choices</h2>
            <p>
              You may stop using the service at any time. For account or data deletion requests, contact the project owner through the project submission contact details.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
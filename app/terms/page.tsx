import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] px-6 py-16 text-zinc-200">
      <article className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-8">
        <Link href="/" className="text-sm text-violet-300 hover:text-violet-200">
          ← Back to StudyAI
        </Link>
        <h1 className="mt-8 text-3xl font-bold text-white">Terms of Service</h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated: September 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-zinc-300">
          <section>
            <h2 className="text-lg font-semibold text-white">Educational use</h2>
            <p>StudyAI provides AI-generated study support for educational purposes. Review important information with a trusted source or instructor.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-white">Responsible use</h2>
            <p>Do not use the service to submit generated work as your own where academic rules prohibit it, or to upload content you do not have permission to use.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-white">Availability</h2>
            <p>The project is provided as a student-built demonstration and may change or become unavailable without notice.</p>
          </section>
        </div>
      </article>
    </main>
  );
}

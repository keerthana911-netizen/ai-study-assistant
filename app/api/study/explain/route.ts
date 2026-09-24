import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateExplanation } from "@/lib/groq";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { topic, difficulty, chatSessionId } = await req.json();
    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const explanation = await generateExplanation(topic, difficulty ?? "BEGINNER");

    let sessionId = chatSessionId;
    if (!sessionId) {
      const newSession = await prisma.chatSession.create({
        data: {
          userId: session.user.id,
          topic,
          difficulty: difficulty ?? "BEGINNER",
        },
      });
      sessionId = newSession.id;
    }

    await prisma.message.createMany({
      data: [
        { chatSessionId: sessionId, role: "user", content: `Explain: ${topic}` },
        { chatSessionId: sessionId, role: "assistant", content: explanation },
      ],
    });

    return NextResponse.json({ explanation, chatSessionId: sessionId });
  } catch (err) {
    console.error("Explain error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate explanation" },
      { status: 500 }
    );
  }
}

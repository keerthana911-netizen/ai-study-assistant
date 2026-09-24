import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateQuiz } from "@/lib/groq";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { topic, difficulty } = await req.json();
    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const questions = await generateQuiz(topic, difficulty ?? "BEGINNER");

    const quiz = await prisma.quiz.create({
      data: {
        userId: session.user.id,
        topic,
        difficulty: difficulty ?? "BEGINNER",
        questions,
      },
    });

    return NextResponse.json(quiz);
  } catch (err) {
    console.error("Quiz error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate quiz" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const quizzes = await prisma.quiz.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(quizzes);
}

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateNotes } from "@/lib/groq";

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

    const content = await generateNotes(topic, difficulty ?? "BEGINNER");

    const note = await prisma.note.create({
      data: {
        userId: session.user.id,
        topic,
        content,
        difficulty: difficulty ?? "BEGINNER",
      },
    });

    return NextResponse.json(note);
  } catch (err) {
    console.error("Notes error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate notes" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const notes = await prisma.note.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(notes);
}

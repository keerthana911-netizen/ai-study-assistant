import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateStudyPlan } from "@/lib/groq";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { topic, difficulty } = await req.json();
    const cleanTopic = typeof topic === "string" ? topic.trim() : "";
    if (!cleanTopic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const selectedDifficulty = difficulty ?? "BEGINNER";
    const plan = await generateStudyPlan(cleanTopic, selectedDifficulty);
    const savedPlan = await prisma.studyPlan.create({
      data: {
        userId: session.user.id,
        topic: cleanTopic,
        content: plan,
        difficulty: selectedDifficulty,
      },
    });

    return NextResponse.json({ plan, studyPlanId: savedPlan.id });
  } catch (err) {
    console.error("Study plan error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate study plan" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const plans = await prisma.studyPlan.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(plans);
}

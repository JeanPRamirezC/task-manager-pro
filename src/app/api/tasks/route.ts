import { getServerSession } from "next-auth";
import { authConfig } from "../auth/[...nextauth]/auth.config";
import { db } from "@/lib/db";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authConfig);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userTasks = await db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, session.user.id));

  return NextResponse.json(userTasks);
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authConfig);

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { title, description, status } = body;

    if (!title || typeof title !== 'string') {
      return new NextResponse('Title is required', { status: 400 });
    }

    const newTask = await db
      .insert(tasks)
      .values({
        title,
        description,
        status: status || 'pending',
        userId: session.user.id, // ← aquí se asocia la tarea con el usuario
      })
      .returning();

    return NextResponse.json(newTask[0]);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error creating task', { status: 500 });
  }
}
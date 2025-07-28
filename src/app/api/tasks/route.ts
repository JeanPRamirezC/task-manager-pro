// src/app/api/tasks/route.ts
import { db } from '@/lib/db';
import { tasks } from '@/db/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

// GET: Obtener todas las tareas
export async function GET() {
  try {
    const allTasks = await db.select().from(tasks);
    return NextResponse.json(allTasks);
  } catch (error) {
    return new NextResponse('Error fetching tasks', { status: 500 });
  }
}

// POST: Crear nueva tarea
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, status } = body;

    if (!title || typeof title !== 'string') {
      return new NextResponse('Title is required', { status: 400 });
    }

    const newTask = await db.insert(tasks).values({
      title,
      description,
      status: status || 'pending',
    }).returning();

    return NextResponse.json(newTask[0]);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error creating task', { status: 500 });
  }
}

// src/app/api/tasks/[id]/route.ts
import { db } from '@/lib/db';
import { tasks } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

type Params = {
  params: { id: string };
};

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const taskId = Number(params.id);

    if (isNaN(taskId)) {
      return new NextResponse('ID inválido', { status: 400 });
    }
    await db.delete(tasks).where(eq(tasks.id, taskId));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse('Error eliminando tarea', { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const taskId = Number(params.id);
    if (isNaN(taskId)) {
      return new NextResponse('ID inválido', { status: 400 });
    }

    const body = await req.json();
    const { title, description, status } = body;

    await db.update(tasks)
      .set({
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status }),
      })
      .where(eq(tasks.id, taskId));

    return new NextResponse('Tarea actualizada', { status: 200 });
  } catch (error) {
    return new NextResponse('Error actualizando tarea', { status: 500 });
  }
}
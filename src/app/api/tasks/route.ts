import { getServerSession } from 'next-auth';
import { authConfig } from '../auth/[...nextauth]/auth.config';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tasks } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { isValidStatus, type TaskStatus } from '@/lib/constants';

// GET /api/tasks?status=pending|in-progress|completed
export async function GET(req: Request) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const statusParam = searchParams.get('status');

  const baseWhere = eq(tasks.userId, session.user.id);
  const where = isValidStatus(statusParam) ? and(baseWhere, eq(tasks.status, statusParam)) : baseWhere;

  const data = await db
    .select()
    .from(tasks)
    .where(where)
    .orderBy(desc(tasks.createdAt));

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const title: unknown = body?.title;
    const description: unknown = body?.description ?? null;
    const statusInput: unknown = body?.status;

    if (typeof title !== 'string' || !title.trim()) {
      return new NextResponse('Title is required', { status: 400 });
    }

    const safeStatus: TaskStatus = isValidStatus(statusInput) ? statusInput : 'pending';

    const [newTask] = await db
      .insert(tasks)
      .values({
        title: title.trim(),
        description: typeof description === 'string' ? description : null,
        status: safeStatus,
        userId: session.user.id,
      })
      .returning();

    return NextResponse.json(newTask);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error creating task', { status: 500 });
  }
}

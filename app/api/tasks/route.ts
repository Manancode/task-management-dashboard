// app/api/tasks/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import connectToDatabase from '@/lib/db';
import Task from '@/models/Task';

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  await connectToDatabase();
  const tasks = await Task.find({ userId: session.user.id });

  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const { title, description, status, priority, dueDate } = await request.json();

  await connectToDatabase();
  const task = new Task({
    title,
    description,
    status,
    priority,
    dueDate,
    userId: session.user.id,
  });

  await task.save();

  return NextResponse.json(task, { status: 201 });
}

export async function PUT(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const { id, ...updateData } = await request.json();

  await connectToDatabase();
  const task = await Task.findOneAndUpdate(
    { _id: id, userId: session.user.id },
    updateData,
    { new: true }
  );

  if (!task) {
    return NextResponse.json({ message: 'Task not found' }, { status: 404 });
  }

  return NextResponse.json(task);
}

export async function DELETE(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ message: 'Task ID is required' }, { status: 400 });
  }

  await connectToDatabase();
  const task = await Task.findOneAndDelete({ _id: id, userId: session.user.id });

  if (!task) {
    return NextResponse.json({ message: 'Task not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Task deleted successfully' });
}
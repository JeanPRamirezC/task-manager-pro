'use client';

import { useEffect, useMemo, useState } from 'react';
import TaskForm from './components/TaskForm';
import FiltersBar from './components/FiltersBar';
import { AuthStatus } from './components/AuthStatus';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { isValidStatus, type TaskStatus, STATUS_LABELS } from '@/lib/constants';

type Task = {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
};

export default function HomePage() {
  const { data: session, status: sessionStatus } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const router = useRouter();
  const search = useSearchParams();

  // initial status from URL
  const urlStatus = search.get('status');
  const initialStatus: TaskStatus | '' = isValidStatus(urlStatus) ? urlStatus : '';
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>(initialStatus);

  // API URL based on filter
  const apiUrl = useMemo(() => {
    const base = '/api/tasks';
    if (!statusFilter) return base;
    const p = new URLSearchParams({ status: statusFilter });
    return `${base}?${p.toString()}`;
  }, [statusFilter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(apiUrl);
      if (!res.ok) {
        if (res.status === 401) return;
        throw new Error('Failed to fetch tasks');
      }
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // sync filter with URL
  useEffect(() => {
    const url = new URL(window.location.href);
    if (statusFilter) url.searchParams.set('status', statusFilter);
    else url.searchParams.delete('status');
    router.replace(url.pathname + (url.search || ''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl]);

  // CRUD helpers
  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (res.ok) fetchTasks();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const toggleStatus = async (task: Task) => {
    const nextStatus: TaskStatus =
      task.status === 'pending'
        ? 'in-progress'
        : task.status === 'in-progress'
        ? 'completed'
        : 'pending';

    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) fetchTasks();
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
  };

  const saveChanges = async (id: number) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      });
      if (res.ok) {
        setEditingId(null);
        fetchTasks();
      }
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  // session gating
  if (sessionStatus === 'loading') return <p className="text-gray-500 p-6">Loading session…</p>;
  if (!session) {
    return (
      <div className="text-center mt-12">
        <p className="text-gray-600 text-lg">You must sign in to see your tasks.</p>
      </div>
    );
  }

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-8">
      <header className="flex items-center gap-3">
        <span className="text-4xl">📝</span>
        <h1 className="text-3xl font-bold">Task Manager Pro</h1>
      </header>

      <section className="space-y-4">
        <FiltersBar value={statusFilter} onChange={setStatusFilter} />
        <AuthStatus />
        <TaskForm onTaskCreated={fetchTasks} initialStatus={(statusFilter || 'pending') as TaskStatus} />
      </section>

      <section>
        {loading ? (
          <p className="text-gray-500">Loading tasks…</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500">
            {statusFilter
              ? `No tasks with status “${STATUS_LABELS[statusFilter]}”.`
              : 'No tasks yet.'}
          </p>
        ) : (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li key={task.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                {editingId === task.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <textarea
                      className="w-full border rounded px-3 py-2"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => saveChanges(task.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-600 hover:underline text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-1">
                      <h2 className="text-lg font-semibold">{task.title}</h2>
                      <p className="text-sm text-gray-600">{task.description}</p>
                      <p className="text-xs font-medium text-blue-600 mt-1 uppercase">
                        Status: {STATUS_LABELS[task.status]}
                      </p>
                      <div className="flex gap-3 mt-2">
                        <button
                          onClick={() => toggleStatus(task)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Change status
                        </button>
                        <button
                          onClick={() => startEditing(task)}
                          className="text-xs text-gray-600 hover:underline"
                        >
                          ✏️ Edit
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                      title="Delete task"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

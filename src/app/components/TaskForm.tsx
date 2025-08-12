'use client';

import { useState } from 'react';
import { STATUS_VALUES, STATUS_LABELS, isValidStatus, type TaskStatus } from '@/lib/constants';

type Props = {
  onTaskCreated: () => void;
  initialStatus?: TaskStatus; // defaults to the active filter
};

export default function TaskForm({ onTaskCreated, initialStatus = 'pending' }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(initialStatus);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          status: isValidStatus(status) ? status : 'pending',
        }),
      });

      if (res.ok) {
        setTitle('');
        setDescription('');
        setStatus(initialStatus);
        onTaskCreated();
      } else {
        console.error('Failed to create task');
      }
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border rounded-lg shadow p-4 space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2 text-purple-700">
        <span className="text-2xl">➕</span> New Task
      </h2>

      <div className="flex flex-col md:flex-row md:items-center md:gap-4">
        <div className="flex-1">
          <label htmlFor="title" className="sr-only">Title</label>
          <input
            id="title"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex-1 mt-2 md:mt-0">
          <label htmlFor="description" className="sr-only">Description</label>
          <input
            id="description"
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="mt-2 md:mt-0">
          <label htmlFor="status" className="sr-only">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => {
              const v = e.target.value;
              if (isValidStatus(v)) setStatus(v);
            }}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {STATUS_VALUES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 md:mt-0 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? 'Creating…' : 'Create Task'}
          {!loading && <span>📌</span>}
        </button>
      </div>
    </form>
  );
}

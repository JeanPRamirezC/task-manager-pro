'use client';

import { useState } from 'react';

type Props = {
  onTaskCreated: () => void;
};

export default function TaskForm({ onTaskCreated }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, status }),
      });

      if (res.ok) {
        setTitle('');
        setDescription('');
        setStatus('pending');
        onTaskCreated();
      } else {
        console.error('Error al crear tarea');
      }
    } catch (error) {
      console.error('Error de red:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border rounded-lg shadow p-4 space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2 text-purple-700">
        <span className="text-2xl">➕</span> Nueva Tarea
      </h2>

      <div className="flex flex-col md:flex-row md:items-center md:gap-4">
        <div className="flex-1">
          <label htmlFor="title" className="sr-only">Título</label>
          <input
            id="title"
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex-1 mt-2 md:mt-0">
          <label htmlFor="description" className="sr-only">Descripción</label>
          <input
            id="description"
            type="text"
            placeholder="Descripción (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="mt-2 md:mt-0">
          <label htmlFor="status" className="sr-only">Estado</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="pending">Pendiente</option>
            <option value="in-progress">En progreso</option>
            <option value="completed">Completada</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 md:mt-0 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? 'Creando...' : 'Crear Tarea'}
          {!loading && <span>📌</span>}
        </button>
      </div>
    </form>
  );
}

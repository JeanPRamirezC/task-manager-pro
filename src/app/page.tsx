'use client';

import { useEffect, useState } from 'react';
import TaskForm from './components/TaskForm';
import { AuthStatus } from './components/AuthStatus';
import { useSession } from 'next-auth/react';

type Task = {
  id: number;
  title: string;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

const fetchTasks = async () => {
  try {
    const res = await fetch('/api/tasks');

    if (!res.ok) {
      if (res.status === 401) {
        console.warn('Usuario no autenticado');
        return;
      }
      throw new Error('Error al obtener tareas');
    }

    const data = await res.json(); // ✅ Solo si fue exitosa la respuesta
    setTasks(data);
  } catch (error) {
    console.error('Error fetching tasks:', error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('¿Estás seguro de eliminar esta tarea?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (res.ok) fetchTasks();
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
    }
  };

  const toggleStatus = async (task: Task) => {
    const nextStatus =
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
      console.error('Error de red:', error);
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
      console.error('Error al actualizar tarea:', error);
    }
  };

  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p className="text-gray-500">Cargando sesión...</p>;
  }

  if (!session) {
    return (
      <div className="text-center mt-12">
        <p className="text-gray-600 text-lg">Debes iniciar sesión para ver tus tareas.</p>
      </div>
    );
  }

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-8">
      <header className="flex items-center gap-3">
        <span className="text-4xl">📝</span>
        <h1 className="text-3xl font-bold">Task Manager Pro</h1>
      </header>

      <section>
        <AuthStatus />
        <TaskForm onTaskCreated={fetchTasks} />
      </section>

      <section>
        {loading ? (
          <p className="text-gray-500">Cargando tareas...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500">No hay tareas todavía.</p>
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
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-600 hover:underline text-sm"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-1">
                      <h2 className="text-lg font-semibold">{task.title}</h2>
                      <p className="text-sm text-gray-600">{task.description}</p>
                      <p className="text-xs font-medium text-blue-600 mt-1 uppercase">
                        Estado: {task.status}
                      </p>
                      <div className="flex gap-3 mt-2">
                        <button
                          onClick={() => toggleStatus(task)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Cambiar estado
                        </button>
                        <button
                          onClick={() => startEditing(task)}
                          className="text-xs text-gray-600 hover:underline"
                        >
                          ✏️ Editar
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                      title="Eliminar tarea"
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


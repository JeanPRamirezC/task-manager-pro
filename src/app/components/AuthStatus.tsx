'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p className="text-gray-500">Cargando sesión...</p>;

  if (!session) {
    return (
      <button
        onClick={() => signIn()}
        className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
      >
        Iniciar sesión
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between mb-4 gap-4">
      <span className="text-sm text-gray-700">👤 {session.user.name || session.user.email}</span>
      <button
        onClick={() => signOut()}
        className="text-red-500 hover:text-red-700 text-sm"
      >
        Cerrar sesión
      </button>
    </div>
  );
}

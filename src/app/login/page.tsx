// src/app/login/page.tsx
'use client';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') || '/';

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Inicia sesión</h1>
        <button
          onClick={() => signIn('github', { callbackUrl })}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded flex items-center justify-center gap-2"
        >
          <span>🐱</span> Iniciar sesión con GitHub
        </button>
      </div>
    </main>
  );
}

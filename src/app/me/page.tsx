"use client";
import Link from "next/link";

import { useEffect, useState } from "react";

type User = {
  userId: string;
  email: string;
  username?: string;
  points?: number;
};

export default function UserPage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/v1/auth/me");

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Erro ao buscar usuário.");
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch {
        setError("Erro inesperado.");
      }
    };

    fetchUser();
  }, []);

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  if (!user) {
    return <p className="text-center">Carregando...</p>;
  }

  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Olá, {user.username}!</h1>
      <p>Email: {user.email}</p>
      {user.points !== undefined && <p>Pontuação: {user.points}</p>}

      <Link href="/" passHref>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Voltar para a Home
        </button>
      </Link>
    </main>
  );
}

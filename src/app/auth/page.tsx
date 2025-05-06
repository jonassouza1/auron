"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  type Error = {
    message: string;
  };
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      if (mode === "register") {
        // 1. Cadastro
        const resRegister = await fetch("/api/v1/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        });

        if (!resRegister.ok) {
          const { error } = await resRegister.json();
          throw new Error(error || "Erro ao cadastrar");
        }

        // 2. Login automático
        const resLogin = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!resLogin.ok) {
          const { error } = await resLogin.json();
          throw new Error(error || "Erro ao fazer login");
        }
      } else {
        // Login normal
        const resLogin = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!resLogin.ok) {
          const { error } = await resLogin.json();
          throw new Error(error || "Erro ao fazer login");
        }
      }

      // Redireciona para página do usuário
      router.push("/me");
    } catch (err: unknown) {
      setError((err as Error).message || "Erro inesperado");
    }
  }

  return (
    <main className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">
        {mode === "login" ? "Entrar na conta" : "Criar conta"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <input
            type="text"
            placeholder="Usuário"
            className="w-full border p-2 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="E-mail"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {mode === "login" ? "Entrar" : "Cadastrar"}
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>

      <p className="text-center text-sm">
        {mode === "login" ? (
          <>
            Não tem uma conta?{" "}
            <button
              className="text-blue-600"
              onClick={() => setMode("register")}
            >
              Cadastre-se
            </button>
          </>
        ) : (
          <>
            Já tem conta?{" "}
            <button className="text-blue-600" onClick={() => setMode("login")}>
              Faça login
            </button>
          </>
        )}
      </p>
    </main>
  );
}

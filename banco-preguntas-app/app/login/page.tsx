"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { ArrowLeft, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    if (mode === "register") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      setLoading(false);

      if (error) {
        setError(error.message);
        return;
      }

      setMessage("Cuenta creada. Ahora intenta iniciar sesión.");
      setMode("login");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      console.error("Error login:", error);
      setError(error.message);
      return;
    }

    if (!data.session) {
      setError("No se pudo iniciar sesión. Revisa si el correo necesita confirmación.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-[#f8f7ff] px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-48px)] max-w-6xl gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div className="rounded-[2.5rem] bg-gradient-to-br from-violet-700 via-fuchsia-600 to-orange-400 p-8 text-white shadow-2xl shadow-violet-200 sm:p-10">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white backdrop-blur transition hover:bg-white/25"
          >
            <ArrowLeft size={17} />
            Volver al inicio
          </Link>

          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20 backdrop-blur">
            <Sparkles size={32} />
          </div>

          <h1 className="max-w-xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Tu banco de preguntas, simulacros y flashcards en un solo lugar.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-white/85">
            Inicia sesión para guardar tus preguntas, crear simulacros y estudiar
            desde cualquier dispositivo.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <MiniCard value="1" label="Cuenta" />
            <MiniCard value="∞" label="Dispositivos" />
            <MiniCard value="100%" label="Personal" />
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-white/80 bg-white/85 p-6 shadow-xl shadow-slate-200/70 backdrop-blur sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-500">
              Acceso
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight">
              {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {mode === "login"
                ? "Entra con tu correo y contraseña para acceder a tu banco personal."
                : "Crea una cuenta para guardar tus preguntas y resultados."}
            </p>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-2 rounded-full bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
                setMessage("");
              }}
              className={`rounded-full px-4 py-2 text-sm font-black transition ${
                mode === "login"
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Iniciar sesión
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError("");
                setMessage("");
              }}
              className={`rounded-full px-4 py-2 text-sm font-black transition ${
                mode === "register"
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Crear cuenta
            </button>
          </div>

          <form onSubmit={handleAuth} className="grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-black text-slate-700">Correo</span>

              <div className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3">
                <Mail size={19} className="text-slate-400" />

                <input
                  type="email"
                  required
                  placeholder="tu-correo@ejemplo.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-black text-slate-700">
                Contraseña
              </span>

              <div className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3">
                <LockKeyhole size={19} className="text-slate-400" />

                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </label>

            {error && (
              <div className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Procesando..."
                : mode === "login"
                  ? "Entrar"
                  : "Crear cuenta"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

function MiniCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-3xl bg-white/15 p-4 text-center backdrop-blur">
      <p className="text-2xl font-black">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-wide text-white/75">
        {label}
      </p>
    </div>
  );
}
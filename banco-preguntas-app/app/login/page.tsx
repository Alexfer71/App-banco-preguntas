"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  ClipboardList,
  LockKeyhole,
  Mail,
  Sparkles,
  Upload,
} from "lucide-react";
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
    <main className="min-h-screen bg-[#fbfcff] text-[#081038]">
      <nav className="border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <section className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 rotate-[-8deg] items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-200">
              <BookOpen size={24} />
            </div>
            <h1 className="text-2xl font-black tracking-tight">Estudia+</h1>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft size={17} />
            Inicio
          </Link>
        </section>
      </nav>

      <section className="mx-auto grid min-h-[calc(100vh-81px)] max-w-7xl gap-10 px-5 py-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
        <div className="order-2 lg:order-1">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-black text-indigo-600">
            <Sparkles size={17} />
            Acceso a tu espacio de estudio
          </div>

          <h2 className="text-5xl font-black leading-[1.08] tracking-tight sm:text-6xl">
            Entra y sigue
            <br />
            estudiando{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
              mejor.
            </span>
          </h2>

          <p className="mt-6 max-w-xl text-lg font-medium leading-8 text-slate-600">
            Guarda tus bancos de preguntas, crea simulacros y organiza tus
            flashcards desde un panel personal, rápido y responsive.
          </p>

          <div className="mt-9 grid max-w-2xl gap-4 sm:grid-cols-2">
            <InfoCard
              icon={<Upload size={24} />}
              title="Importa bancos"
              text="Sube preguntas desde archivos Excel o CSV."
              color="bg-blue-100 text-blue-600"
            />

            <InfoCard
              icon={<ClipboardList size={24} />}
              title="Simulacros"
              text="Practica con preguntas de tus bancos guardados."
              color="bg-emerald-100 text-emerald-600"
            />

            <InfoCard
              icon={<Brain size={24} />}
              title="Flashcards"
              text="Crea tarjetas para memorizar información."
              color="bg-violet-100 text-violet-600"
            />

            <InfoCard
              icon={<BarChart3 size={24} />}
              title="Progreso"
              text="Organiza tu estudio de forma más clara."
              color="bg-yellow-100 text-yellow-600"
            />
          </div>
        </div>

        <div className="order-1 rounded-[2.2rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-200/80 lg:order-2">
          <div className="rounded-[1.8rem] bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-6 sm:p-8">
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black text-indigo-600">Acceso</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight">
                  {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
                </h2>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                  {mode === "login"
                    ? "Entra con tu correo y contraseña para acceder a tu panel."
                    : "Crea una cuenta para guardar tu información de estudio."}
                </p>
              </div>

              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-lg sm:flex">
                <CheckCircle2 size={28} />
              </div>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                  setMessage("");
                }}
                className={`rounded-xl px-4 py-3 text-sm font-black transition ${
                  mode === "login"
                    ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-100"
                    : "text-slate-500 hover:bg-slate-50"
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
                className={`rounded-xl px-4 py-3 text-sm font-black transition ${
                  mode === "register"
                    ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-100"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                Crear cuenta
              </button>
            </div>

            <form onSubmit={handleAuth} className="grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-black text-slate-700">Correo</span>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-indigo-400">
                  <Mail size={19} className="text-slate-400" />

                  <input
                    type="email"
                    required
                    placeholder="tu-correo@ejemplo.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
                  />
                </div>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black text-slate-700">
                  Contraseña
                </span>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-indigo-400">
                  <LockKeyhole size={19} className="text-slate-400" />

                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
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
                className="mt-2 inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-6 py-4 text-sm font-black text-white shadow-xl shadow-indigo-200 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Procesando..."
                  : mode === "login"
                    ? "Entrar al dashboard"
                    : "Crear cuenta"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  text,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  color: string;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}>
        {icon}
      </div>
      <h4 className="font-black">{title}</h4>
      <p className="mt-2 text-sm font-medium leading-6 text-slate-500">{text}</p>
    </article>
  );
}
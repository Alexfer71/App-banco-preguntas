"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Brain,
  FileQuestion,
  LogOut,
  PlusCircle,
  Sparkles,
  Upload,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";

type QuestionBank = {
  id: string;
  name: string;
  description: string | null;
  total_questions: number;
  created_at: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [banks, setBanks] = useState<QuestionBank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (!session?.user) {
        setLoading(false);
        router.replace("/login");
        return;
      }

      setEmail(session.user.email || "");

      const { data, error } = await supabase
        .from("question_banks")
        .select("id, name, description, total_questions, created_at")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (!mounted) return;

      if (error) {
        console.error("Error al cargar bancos:", error);
        setBanks([]);
      } else {
        setBanks(data || []);
      }

      setLoading(false);
    };

    void loadDashboard();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setEmail("");
        setBanks([]);
        router.replace("/login");
      }
    });

    window.addEventListener("focus", loadDashboard);
    window.addEventListener("pageshow", loadDashboard);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      window.removeEventListener("focus", loadDashboard);
      window.removeEventListener("pageshow", loadDashboard);
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  const totalQuestions = banks.reduce(
    (total, bank) => total + (bank.total_questions || 0),
    0
  );

  return (
    <main className="min-h-screen bg-[#fbfcff] text-[#081038]">
      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <section className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 rotate-[-8deg] items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-200">
              <BookOpen size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Estudia+</h1>
              <p className="hidden text-xs font-bold text-slate-500 sm:block">
                Panel de estudio
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <LogOut size={17} />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </section>
      </nav>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <header className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div className="rounded-[2.2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-black text-indigo-600">
              <Sparkles size={17} />
              Bienvenido de nuevo
            </div>

            <h2 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Tu espacio para
              <br />
              estudiar{" "}
              <span className="bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
                mejor.
              </span>
            </h2>

            <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-slate-600 sm:text-base">
              Sesión iniciada como{" "}
              <span className="font-black text-slate-900">
                {email || "cargando..."}
              </span>
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/importar"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-6 py-4 text-sm font-black text-white shadow-xl shadow-indigo-200 transition hover:scale-[1.02]"
              >
                <Upload size={18} />
                Importar banco
              </Link>

              <Link
                href="/flashcards"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-4 text-sm font-black text-slate-900 shadow-sm transition hover:bg-slate-50"
              >
                <Brain size={18} />
                Flashcards
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <StatCard
              title="Bancos guardados"
              value={loading ? "..." : banks.length}
              icon={<BookOpen size={24} />}
              color="bg-blue-100 text-blue-600"
            />

            <StatCard
              title="Preguntas totales"
              value={loading ? "..." : totalQuestions}
              icon={<FileQuestion size={24} />}
              color="bg-emerald-100 text-emerald-600"
            />

            <StatCard
              title="Modo estudio"
              value="Activo"
              icon={<Brain size={24} />}
              color="bg-violet-100 text-violet-600"
            />
          </div>
        </header>

        <section className="mt-8 rounded-[2.2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black text-indigo-600">
                Bancos de preguntas
              </p>
              <h2 className="mt-1 text-3xl font-black tracking-tight">
                Mis bancos
              </h2>
              <p className="mt-2 text-sm font-medium text-slate-500">
                Aquí aparecen los bancos que guardaste desde la pantalla de importación.
              </p>
            </div>

            <Link
              href="/importar"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-indigo-200 transition hover:scale-[1.02]"
            >
              <PlusCircle size={18} />
              Nuevo banco
            </Link>
          </div>

          {loading && (
            <div className="mt-8 rounded-3xl bg-slate-50 p-8 text-center">
              <p className="font-black text-slate-500">Cargando bancos...</p>
            </div>
          )}

          {!loading && banks.length === 0 && (
            <div className="mt-8 rounded-[2rem] bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-200">
                <Upload size={30} />
              </div>

              <h3 className="mt-5 text-2xl font-black">
                Importa tu primer banco
              </h3>

              <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-6 text-slate-600">
                Sube un archivo Excel o CSV con tus preguntas. Luego podrás crear
                simulacros y estudiar por banco.
              </p>

              <Link
                href="/importar"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-6 py-4 text-sm font-black text-white shadow-xl shadow-indigo-200 transition hover:scale-[1.02]"
              >
                <Upload size={18} />
                Importar preguntas
              </Link>
            </div>
          )}

          {!loading && banks.length > 0 && (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {banks.map((bank) => (
                <article
                  key={bank.id}
                  className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                      <BookOpen size={26} />
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                      {bank.total_questions} preguntas
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-black">{bank.name}</h3>

                  <p className="mt-2 min-h-12 text-sm font-medium leading-6 text-slate-500">
                    {bank.description || "Sin descripción"}
                  </p>

                  <div className="mt-5 grid gap-3">
                    <Link
                      href={`/simulacros/crear?bankId=${bank.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-indigo-100 transition hover:scale-[1.01]"
                    >
                      <PlayCircle size={17} />
                      Crear simulacro
                    </Link>

                    <Link
                      href={`/flashcards?bankId=${bank.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-900 transition hover:bg-slate-50"
                    >
                      <Brain size={17} />
                      Estudiar flashcards
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70">
      <div className="flex items-center gap-4">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}>
          {icon}
        </div>

        <div>
          <p className="text-sm font-black text-slate-500">{title}</p>
          <p className="mt-1 text-3xl font-black text-slate-950">{value}</p>
        </div>
      </div>
    </article>
  );
}
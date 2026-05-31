"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  LogOut,
  Upload,
  FileText,
  PlayCircle,
  Layers,
  Brain,
  PlusCircle,
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

    const user = session.user;
    setEmail(user.email || "");

    const { data, error } = await supabase
      .from("question_banks")
      .select("id, name, description, total_questions, created_at")
      .eq("user_id", user.id)
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

  loadDashboard();

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
    <main className="min-h-screen bg-[#f8f7ff] px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-violet-100/70 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-500">
              Panel personal
            </p>

            <h1 className="mt-1 text-3xl font-black tracking-tight">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Sesión iniciada como: {email || "cargando..."}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <Card
            title="Mis bancos"
            value={loading ? "..." : banks.length}
            icon={<BookOpen size={26} />}
          />

          <Card
            title="Preguntas"
            value={loading ? "..." : totalQuestions}
            icon={<FileText size={26} />}
          />

          <Card
            title="Simulacros"
            value="0"
            icon={<PlayCircle size={26} />}
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-4">
          <ActionCard
            title="Importar banco"
            description="Sube preguntas desde un archivo CSV o Excel."
            href="/importar"
            icon={<Upload size={24} />}
            active
          />

          <ActionCard
            title="Crear simulacro"
            description="Genera una práctica con preguntas de tus bancos."
            href="/simulacros/crear"
            icon={<PlayCircle size={24} />}
            active={banks.length > 0}
          />

          <ActionCard
            title="Flashcards"
            description="Estudia las preguntas en modo tarjetas."
            href="/flashcards"
            icon={<Brain size={24} />}
            active={banks.length > 0}
          />

          <ActionCard
            title="Mis bancos"
            description="Revisa, edita o elimina tus bancos guardados."
            href="/bancos"
            icon={<Layers size={24} />}
            active={banks.length > 0}
          />
        </section>

        <section className="rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-xl shadow-slate-200/70 backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black">Mis bancos de preguntas</h2>
              <p className="mt-1 text-sm text-slate-500">
                Aquí aparecen los bancos que guardaste desde la pantalla de importación.
              </p>
            </div>

            <Link
              href="/importar"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:scale-[1.02]"
            >
              <PlusCircle size={18} />
              Nuevo banco
            </Link>
          </div>

          {loading && (
            <p className="mt-6 text-sm font-semibold text-slate-500">
              Cargando bancos...
            </p>
          )}

          {!loading && banks.length === 0 && (
            <div className="mt-6 rounded-3xl bg-gradient-to-br from-violet-700 via-fuchsia-600 to-orange-400 p-8 text-white shadow-2xl shadow-violet-200">
              <h3 className="text-3xl font-black">Importa tu primer banco</h3>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85">
                Sube un archivo Excel o CSV con tus preguntas. Luego podrás crear
                simulacros, practicar por temas y estudiar con flashcards.
              </p>

              <Link
                href="/importar"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-violet-700 shadow-lg transition hover:scale-[1.02]"
              >
                <Upload size={18} />
                Importar preguntas
              </Link>
            </div>
          )}

          {!loading && banks.length > 0 && (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {banks.map((bank) => (
                <article
                  key={bank.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                    <BookOpen size={24} />
                  </div>

                  <h3 className="mt-4 text-lg font-black">{bank.name}</h3>

                  <p className="mt-2 min-h-10 text-sm leading-6 text-slate-500">
                    {bank.description || "Sin descripción"}
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-100 p-3 text-sm font-black text-slate-700">
                    {bank.total_questions} preguntas
                  </div>

                  <div className="mt-4 grid gap-2">
                    <Link
                      href={`/simulacros/crear?bankId=${bank.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                    >
                      <PlayCircle size={17} />
                      Crear simulacro
                    </Link>

                    <Link
                      href={`/flashcards?bankId=${bank.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-100 px-4 py-3 text-sm font-black text-violet-700 transition hover:bg-violet-200"
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

function Card({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <article className="rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-xl shadow-slate-200/70 backdrop-blur">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
        {icon}
      </div>

      <p className="text-sm font-black text-slate-500">{title}</p>
      <p className="mt-2 text-4xl font-black text-slate-950">{value}</p>
    </article>
  );
}

function ActionCard({
  title,
  description,
  href,
  icon,
  active,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  active: boolean;
}) {
  if (!active) {
    return (
      <article className="rounded-[2rem] border border-slate-200 bg-white/60 p-5 opacity-60 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          {icon}
        </div>

        <h3 className="mt-4 text-lg font-black text-slate-700">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>

        <p className="mt-4 rounded-full bg-slate-100 px-4 py-2 text-center text-xs font-black text-slate-500">
          Importa un banco primero
        </p>
      </article>
    );
  }

  return (
    <Link
      href={href}
      className="rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-xl shadow-slate-200/70 transition hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white">
        {icon}
      </div>

      <h3 className="mt-4 text-lg font-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>

      <p className="mt-4 rounded-full bg-violet-100 px-4 py-2 text-center text-xs font-black text-violet-700">
        Abrir
      </p>
    </Link>
  );
}
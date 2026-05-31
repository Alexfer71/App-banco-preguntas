"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Trash2, PlayCircle, Brain } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type Bank = {
  id: string;
  name: string;
  description: string | null;
  total_questions: number;
  created_at: string;
};

export default function BancosPage() {
  const router = useRouter();
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBanks = async () => {
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      router.replace("/login");
      return;
    }

    const { data, error } = await supabase
      .from("question_banks")
      .select("id, name, description, total_questions, created_at")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setBanks([]);
    } else {
      setBanks(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
  const init = async () => {
    await loadBanks();
  };

  init();
}, []);

  const deleteBank = async (bankId: string) => {
    const confirmDelete = confirm("¿Seguro que quieres eliminar este banco?");
    if (!confirmDelete) return;

    await supabase.from("questions").delete().eq("bank_id", bankId);
    await supabase.from("question_banks").delete().eq("id", bankId);

    loadBanks();
  };

  return (
    <main className="min-h-screen bg-[#f8f7ff] px-4 py-6 text-slate-950">
      <section className="mx-auto max-w-7xl space-y-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black shadow"
        >
          <ArrowLeft size={18} />
          Volver al dashboard
        </Link>

        <header className="rounded-[2rem] bg-white/90 p-6 shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-500">
            Gestión
          </p>
          <h1 className="mt-1 text-3xl font-black">Mis bancos</h1>
          <p className="mt-2 text-sm text-slate-500">
            Revisa, estudia o elimina tus bancos de preguntas.
          </p>
        </header>

        {loading && <p className="font-semibold text-slate-500">Cargando...</p>}

        {!loading && banks.length === 0 && (
          <div className="rounded-[2rem] bg-white p-8 text-center shadow-xl">
            <BookOpen className="mx-auto text-violet-600" size={48} />
            <h2 className="mt-4 text-2xl font-black">No tienes bancos todavía</h2>
            <Link
              href="/importar"
              className="mt-5 inline-block rounded-full bg-violet-600 px-6 py-3 font-black text-white"
            >
              Importar banco
            </Link>
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {banks.map((bank) => (
            <article key={bank.id} className="rounded-[2rem] bg-white p-6 shadow-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <BookOpen />
              </div>

              <h2 className="mt-4 text-xl font-black">{bank.name}</h2>
              <p className="mt-2 text-sm text-slate-500">
                {bank.description || "Sin descripción"}
              </p>

              <p className="mt-4 rounded-2xl bg-slate-100 p-3 text-sm font-black">
                {bank.total_questions || 0} preguntas
              </p>

              <div className="mt-4 grid gap-2">
                <Link
                  href={`/simulacros/crear?bankId=${bank.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-black text-white"
                >
                  <PlayCircle size={17} />
                  Crear simulacro
                </Link>

                <Link
                  href={`/flashcards?bankId=${bank.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-100 px-4 py-3 text-sm font-black text-violet-700"
                >
                  <Brain size={17} />
                  Flashcards
                </Link>

                <button
                  onClick={() => deleteBank(bank.id)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-red-50 px-4 py-3 text-sm font-black text-red-600"
                >
                  <Trash2 size={17} />
                  Eliminar banco
                </button>
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
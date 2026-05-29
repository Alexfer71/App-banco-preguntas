"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { BookOpen, LogOut, Upload } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      setEmail(data.user.email || "");
    };

    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

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
              Sesión iniciada como: {email}
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
          <Card title="Mis bancos" value="0" icon={<BookOpen size={26} />} />
          <Card title="Preguntas" value="0" icon={<BookOpen size={26} />} />
          <Card title="Simulacros" value="0" icon={<BookOpen size={26} />} />
        </section>

        <section className="rounded-[2rem] bg-gradient-to-br from-violet-700 via-fuchsia-600 to-orange-400 p-8 text-white shadow-2xl shadow-violet-200">
          <h2 className="text-3xl font-black">Importa tu primer banco</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85">
            Sube un archivo Excel o CSV con tus preguntas. Luego podrás crear
            simulacros y estudiar con flashcards.
          </p>

          <Link
            href="/importar"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-violet-700 shadow-lg transition hover:scale-[1.02]"
          >
            <Upload size={18} />
            Importar preguntas
          </Link>
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
  value: string;
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
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  PlusCircle,
  Brain,
  Sparkles,
  Layers3,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type FlashcardInput = {
  topic: string;
  title: string;
  content: string;
};

export default function ImportarFlashcardsPage() {
  const router = useRouter();

  const [cards, setCards] = useState<FlashcardInput[]>([
    { topic: "", title: "", content: "" },
  ]);

  const [saving, setSaving] = useState(false);

  const updateCard = (
    index: number,
    field: keyof FlashcardInput,
    value: string
  ) => {
    setCards((prev) =>
      prev.map((card, i) =>
        i === index ? { ...card, [field]: value } : card
      )
    );
  };

  const addCard = () => {
    setCards((prev) => [...prev, { topic: "", title: "", content: "" }]);
  };

  const saveFlashcards = async () => {
    setSaving(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      router.replace("/login");
      return;
    }

    const validCards = cards
      .filter(
        (card) =>
          card.topic.trim() &&
          card.title.trim() &&
          card.content.trim()
      )
      .map((card) => ({
        user_id: session.user.id,
        topic: card.topic.trim(),
        title: card.title.trim(),
        content: card.content.trim(),
      }));

    if (validCards.length === 0) {
      alert("Llena al menos una flashcard completa.");
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("flashcards")
      .insert(validCards);

    if (error) {
      console.error(error);
      alert("Error al guardar flashcards.");
    } else {
      alert("Flashcards guardadas correctamente.");
      router.push("/flashcards");
    }

    setSaving(false);
  };

  return (
    <main className="min-h-screen bg-[#fbfcff] text-[#081038]">
      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <section className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 rotate-[-8deg] items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-200">
              <Brain size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight">
                Importar Flashcards
              </h1>

              <p className="hidden text-xs font-bold text-slate-500 sm:block">
                Tarjetas de memorización
              </p>
            </div>
          </div>

          <Link
            href="/flashcards"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft size={17} />
            Flashcards
          </Link>
        </section>
      </nav>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <header className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2.2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-black text-indigo-600">
              <Sparkles size={17} />
              Aprendizaje inteligente
            </div>

            <h2 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Crea flashcards
              <br />
              para memorizar.
            </h2>

            <p className="mt-5 max-w-xl text-sm font-medium leading-6 text-slate-600 sm:text-base">
              Organiza conceptos importantes por tema y repásalos fácilmente
              desde cualquier dispositivo.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <InfoCard
                icon={<Layers3 size={24} />}
                title="Por temas"
                text="Organiza tarjetas por categorías."
                color="bg-blue-100 text-blue-600"
              />

              <InfoCard
                icon={<FileText size={24} />}
                title="Contenido libre"
                text="Guarda fórmulas, conceptos o resúmenes."
                color="bg-emerald-100 text-emerald-600"
              />

              <InfoCard
                icon={<Brain size={24} />}
                title="Memorización"
                text="Repasa ideas clave rápidamente."
                color="bg-violet-100 text-violet-600"
              />

              <InfoCard
                icon={<CheckCircle2 size={24} />}
                title="Estudio organizado"
                text="Mantén tu aprendizaje más claro."
                color="bg-yellow-100 text-yellow-600"
              />
            </div>
          </div>

          <div className="rounded-[2.2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
            <div className="mb-6">
              <p className="text-sm font-black text-indigo-600">
                Nueva colección
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight">
                Añadir flashcards
              </h2>

              <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                Crea tarjetas con tema, título e información para empezar a
                estudiar.
              </p>
            </div>

            <section className="space-y-5">
              {cards.map((card, index) => (
                <article
                  key={index}
                  className="rounded-[2rem] border border-slate-200 bg-slate-50/70 p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-black text-indigo-600">
                      Flashcard {index + 1}
                    </p>

                    <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500 shadow-sm">
                      Tarjeta
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      value={card.topic}
                      onChange={(e) =>
                        updateCard(index, "topic", e.target.value)
                      }
                      placeholder="Tema. Ej: Matemáticas"
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold outline-none transition focus:border-indigo-400"
                    />

                    <input
                      value={card.title}
                      onChange={(e) =>
                        updateCard(index, "title", e.target.value)
                      }
                      placeholder="Título. Ej: Fórmula del área"
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold outline-none transition focus:border-indigo-400"
                    />
                  </div>

                  <textarea
                    value={card.content}
                    onChange={(e) =>
                      updateCard(index, "content", e.target.value)
                    }
                    placeholder="Información para memorizar..."
                    rows={5}
                    className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold outline-none transition focus:border-indigo-400"
                  />
                </article>
              ))}
            </section>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={addCard}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <PlusCircle size={18} />
                Añadir otra flashcard
              </button>

              <button
                onClick={saveFlashcards}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-6 py-4 text-sm font-black text-white shadow-xl shadow-indigo-200 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={18} />
                {saving ? "Guardando..." : "Guardar flashcards"}
              </button>
            </div>
          </div>
        </header>
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
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}
      >
        {icon}
      </div>

      <h4 className="font-black">{title}</h4>

      <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
        {text}
      </p>
    </article>
  );
}
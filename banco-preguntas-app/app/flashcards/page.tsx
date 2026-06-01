"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Brain,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Pencil,
  Trash2,
  Save,
  X,
  Sparkles,
  Layers3,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type Flashcard = {
  id: string;
  topic: string;
  title: string;
  content: string;
  created_at: string;
};

export default function FlashcardsPage() {
  const router = useRouter();

  const [cards, setCards] = useState<Flashcard[]>([]);
  const [selectedTopic, setSelectedTopic] = useState("Todos");
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [editTopic, setEditTopic] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);

  const loadCards = useCallback(async () => {
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      router.replace("/login");
      return;
    }

    const { data, error } = await supabase
      .from("flashcards")
      .select("id, topic, title, content, created_at")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      setCards([]);
    } else {
      setCards(data || []);
    }

    setLoading(false);
  }, [router]);

  useEffect(() => {
  const init = async () => {
    await loadCards();
    };

    init();
  }, []);
  const topics = useMemo(() => {
    return ["Todos", ...Array.from(new Set(cards.map((card) => card.topic)))];
  }, [cards]);

  const filteredCards = useMemo(() => {
    if (selectedTopic === "Todos") return cards;
    return cards.filter((card) => card.topic === selectedTopic);
  }, [cards, selectedTopic]);

  const current = filteredCards[index];

  const nextCard = () => {
    setIndex((prev) => (prev + 1 >= filteredCards.length ? 0 : prev + 1));
  };

  const prevCard = () => {
    setIndex((prev) => (prev - 1 < 0 ? filteredCards.length - 1 : prev - 1));
  };

  const changeTopic = (topic: string) => {
    setSelectedTopic(topic);
    setIndex(0);
  };

  const openEdit = (card: Flashcard) => {
    setEditingCard(card);
    setEditTopic(card.topic);
    setEditTitle(card.title);
    setEditContent(card.content);
  };

  const closeEdit = () => {
    setEditingCard(null);
    setEditTopic("");
    setEditTitle("");
    setEditContent("");
  };

  const saveEdit = async () => {
    if (!editingCard) return;

    if (!editTopic.trim() || !editTitle.trim() || !editContent.trim()) {
      alert("Llena tema, título e información.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("flashcards")
      .update({
        topic: editTopic.trim(),
        title: editTitle.trim(),
        content: editContent.trim(),
      })
      .eq("id", editingCard.id);

    if (error) {
      console.error(error);
      alert("Error al editar flashcard.");
    } else {
      closeEdit();
      await loadCards();
    }

    setSaving(false);
  };

  const deleteCard = async (card: Flashcard) => {
    const confirmDelete = confirm(
      `¿Seguro que quieres eliminar la flashcard "${card.title}"?`
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("flashcards")
      .delete()
      .eq("id", card.id);

    if (error) {
      console.error(error);
      alert("Error al eliminar flashcard.");
      return;
    }

    setCards((prev) => prev.filter((item) => item.id !== card.id));
    setIndex(0);
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
                Flashcards
              </h1>
              <p className="hidden text-xs font-bold text-slate-500 sm:block">
                Tarjetas de memorización
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <ArrowLeft size={17} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            <Link
              href="/importar-flashcards"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-indigo-200 transition hover:scale-[1.02]"
            >
              <PlusCircle size={17} />
              <span className="hidden sm:inline">Importar</span>
            </Link>
          </div>
        </section>
      </nav>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <header className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
          <div className="rounded-[2.2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-black text-indigo-600">
              <Sparkles size={17} />
              Modo memorización
            </div>

            <h2 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Repasa tus
              <br />
              ideas clave.
            </h2>

            <p className="mt-5 max-w-xl text-sm font-medium leading-6 text-slate-600 sm:text-base">
              Escoge un tema, navega entre tarjetas y memoriza información
              importante de forma visual y ordenada.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <MiniStat
                title="Tarjetas"
                value={loading ? "..." : cards.length}
                color="bg-blue-100 text-blue-600"
              />

              <MiniStat
                title="Temas"
                value={loading ? "..." : topics.length - 1}
                color="bg-emerald-100 text-emerald-600"
              />
            </div>
          </div>

          <div className="rounded-[2.2rem] border border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-6 shadow-xl shadow-slate-200/70 sm:p-8">
            <div className="flex h-full flex-col justify-between gap-6">
              <div>
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-200">
                  <Layers3 size={30} />
                </div>

                <h3 className="mt-6 text-3xl font-black tracking-tight">
                  Estudia por temas
                </h3>

                <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                  Usa los filtros para escoger una categoría específica o repasa
                  todas tus flashcards en orden.
                </p>
              </div>

              <Link
                href="/importar-flashcards"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-6 py-4 text-sm font-black text-white shadow-xl shadow-indigo-200 transition hover:scale-[1.02] sm:w-fit"
              >
                <PlusCircle size={18} />
                Crear nuevas flashcards
              </Link>
            </div>
          </div>
        </header>

        {loading && (
          <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/70">
            <p className="font-black text-slate-500">
              Cargando flashcards...
            </p>
          </section>
        )}

        {!loading && cards.length === 0 && (
          <section className="mt-8 rounded-[2.2rem] border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/70">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-200">
              <Brain size={30} />
            </div>

            <h2 className="mt-5 text-3xl font-black">
              Todavía no tienes flashcards
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-6 text-slate-600">
              Crea tarjetas con tema, título e información para memorizar datos
              importantes.
            </p>

            <Link
              href="/importar-flashcards"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-6 py-4 text-sm font-black text-white shadow-xl shadow-indigo-200 transition hover:scale-[1.02]"
            >
              <PlusCircle size={18} />
              Crear flashcards
            </Link>
          </section>
        )}

        {!loading && cards.length > 0 && (
          <>
            <section className="mt-8 rounded-[2.2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black text-indigo-600">
                    Temas disponibles
                  </p>
                  <h2 className="mt-1 text-2xl font-black tracking-tight">
                    Escoge qué quieres estudiar
                  </h2>
                </div>

                <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-black text-indigo-600">
                  {filteredCards.length} tarjetas
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => changeTopic(topic)}
                    className={`rounded-xl px-4 py-2.5 text-sm font-black transition ${
                      selectedTopic === topic
                        ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-100"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </section>

            {current && (
              <section className="mt-8 grid gap-5 lg:grid-cols-[auto_1fr_auto] lg:items-center">
                <button
                  onClick={prevCard}
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-lg shadow-slate-200 transition hover:-translate-x-1 hover:bg-slate-50"
                >
                  <ChevronLeft size={30} />
                </button>

                <article className="mx-auto w-full max-w-4xl rounded-[2.3rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-200/80 sm:p-6">
                  <div className="rounded-[1.8rem] bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-6 sm:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black text-indigo-600 shadow-sm">
                          <Sparkles size={14} />
                          {current.topic}
                        </p>

                        <h2 className="mt-6 text-4xl font-black leading-tight tracking-tight text-slate-950">
                          {current.title}
                        </h2>
                      </div>

                      <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-black text-indigo-600">
                        {index + 1} / {filteredCards.length}
                      </span>
                    </div>

                    <div className="mt-7 rounded-[2rem] bg-white p-6 shadow-sm">
                      <p className="whitespace-pre-line text-lg font-semibold leading-8 text-slate-700">
                        {current.content}
                      </p>
                    </div>

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                      <button
                        onClick={() => openEdit(current)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-indigo-100 transition hover:scale-[1.01]"
                      >
                        <Pencil size={17} />
                        Editar flashcard
                      </button>

                      <button
                        onClick={() => deleteCard(current)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-5 py-3 text-sm font-black text-red-600 transition hover:bg-red-100"
                      >
                        <Trash2 size={17} />
                        Eliminar flashcard
                      </button>
                    </div>
                  </div>
                </article>

                <button
                  onClick={nextCard}
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-lg shadow-slate-200 transition hover:translate-x-1 hover:bg-slate-50"
                >
                  <ChevronRight size={30} />
                </button>
              </section>
            )}
          </>
        )}
      </section>

      {editingCard && (
        <section className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[2.2rem] border border-slate-200 bg-white p-6 text-slate-950 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black text-indigo-600">
                  Editar tarjeta
                </p>
                <h2 className="mt-1 text-3xl font-black tracking-tight">
                  Flashcard
                </h2>
              </div>

              <button
                onClick={closeEdit}
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:bg-slate-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <input
                value={editTopic}
                onChange={(e) => setEditTopic(e.target.value)}
                placeholder="Tema"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold outline-none transition focus:border-indigo-400"
              />

              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Título"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold outline-none transition focus:border-indigo-400"
              />

              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Información"
                rows={7}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold outline-none transition focus:border-indigo-400"
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={saveEdit}
                disabled={saving}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-5 py-4 text-sm font-black text-white shadow-xl shadow-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={17} />
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>

              <button
                onClick={closeEdit}
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function MiniStat({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`mb-3 h-3 w-12 rounded-full ${color}`} />
      <p className="text-sm font-black text-slate-500">{title}</p>
      <p className="mt-1 text-2xl font-black text-slate-950">{value}</p>
    </article>
  );
}
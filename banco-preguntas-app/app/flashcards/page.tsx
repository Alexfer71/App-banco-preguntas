"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Brain, RotateCcw } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type Question = {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_e: string | null;
  correct_answer: string;
  explanation: string | null;
  topic: string | null;
};

export default function FlashcardsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bankId = searchParams.get("bankId");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/login");
        return;
      }

      let query = supabase
        .from("questions")
        .select("*")
        .eq("user_id", session.user.id);

      if (bankId) {
        query = query.eq("bank_id", bankId);
      }

      const { data, error } = await query.order("created_at", {
        ascending: true,
      });

      if (error) {
        console.error(error);
        setQuestions([]);
      } else {
        setQuestions(data || []);
      }

      setLoading(false);
    };

    loadQuestions();
  }, [bankId, router]);

  const current = questions[index];

  const next = () => {
    setShowAnswer(false);
    setIndex((prev) => (prev + 1 >= questions.length ? 0 : prev + 1));
  };

  const prev = () => {
    setShowAnswer(false);
    setIndex((prev) => (prev - 1 < 0 ? questions.length - 1 : prev - 1));
  };

  return (
    <main className="min-h-screen bg-[#f8f7ff] px-4 py-6 text-slate-950">
      <section className="mx-auto max-w-4xl space-y-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black shadow"
        >
          <ArrowLeft size={18} />
          Volver al dashboard
        </Link>

        <header className="rounded-[2rem] bg-white/90 p-6 shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-500">
            Estudio
          </p>
          <h1 className="mt-1 flex items-center gap-2 text-3xl font-black">
            <Brain className="text-violet-600" />
            Flashcards
          </h1>
        </header>

        {loading && <p className="font-semibold text-slate-500">Cargando...</p>}

        {!loading && questions.length === 0 && (
          <div className="rounded-[2rem] bg-white p-8 text-center shadow-xl">
            <h2 className="text-2xl font-black">No hay preguntas disponibles</h2>
            <Link
              href="/importar"
              className="mt-5 inline-block rounded-full bg-violet-600 px-6 py-3 font-black text-white"
            >
              Importar preguntas
            </Link>
          </div>
        )}

        {current && (
          <article className="rounded-[2rem] bg-white p-6 shadow-xl">
            <p className="text-sm font-black text-violet-600">
              Pregunta {index + 1} de {questions.length}
            </p>

            {current.topic && (
              <p className="mt-2 inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700">
                {current.topic}
              </p>
            )}

            <h2 className="mt-5 text-2xl font-black leading-snug">
              {current.question_text}
            </h2>

            <div className="mt-6 grid gap-3">
              <Option label="A" text={current.option_a} />
              <Option label="B" text={current.option_b} />
              <Option label="C" text={current.option_c} />
              <Option label="D" text={current.option_d} />
              {current.option_e && <Option label="E" text={current.option_e} />}
            </div>

            {showAnswer && (
              <div className="mt-6 rounded-3xl bg-green-50 p-5 text-green-700">
                <p className="font-black">
                  Respuesta correcta: {current.correct_answer}
                </p>
                {current.explanation && (
                  <p className="mt-2 text-sm font-semibold">
                    {current.explanation}
                  </p>
                )}
              </div>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              <button
                onClick={prev}
                className="rounded-full bg-slate-100 px-4 py-3 font-black"
              >
                Anterior
              </button>

              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="rounded-full bg-violet-600 px-4 py-3 font-black text-white sm:col-span-2"
              >
                {showAnswer ? "Ocultar respuesta" : "Ver respuesta"}
              </button>

              <button
                onClick={next}
                className="rounded-full bg-slate-950 px-4 py-3 font-black text-white"
              >
                Siguiente
              </button>
            </div>

            <button
              onClick={() => {
                setIndex(0);
                setShowAnswer(false);
              }}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-black text-orange-700"
            >
              <RotateCcw size={16} />
              Reiniciar
            </button>
          </article>
        )}
      </section>
    </main>
  );
}

function Option({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <span className="font-black text-violet-600">{label}.</span>{" "}
      <span className="font-semibold text-slate-700">{text}</span>
    </div>
  );
}
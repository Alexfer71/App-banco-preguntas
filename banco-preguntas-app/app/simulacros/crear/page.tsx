"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  PlayCircle,
  XCircle,
  Brain,
  Sparkles,
} from "lucide-react";
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

  export default function CrearSimulacroPage() {
    return (
      <Suspense
        fallback={
          <main className="min-h-screen bg-[#fbfcff] flex items-center justify-center">
            <div className="rounded-2xl bg-white px-8 py-6 shadow-xl">
              <p className="text-lg font-black text-indigo-600">
                Cargando simulacro...
              </p>
            </div>
          </main>
        }
      >
        <CrearSimulacroContent />
      </Suspense>
    );
  }

  function CrearSimulacroContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bankId = searchParams.get("bankId");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [finished, setFinished] = useState(false);
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

  const score = questions.reduce((total, question) => {
    return total + (answers[question.id] === question.correct_answer ? 1 : 0);
  }, 0);

  const finishExam = () => {
    if (Object.keys(answers).length < questions.length) {
      const confirmFinish = confirm(
        "Todavía hay preguntas sin responder. ¿Quieres finalizar igual?"
      );

      if (!confirmFinish) return;
    }

    setFinished(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const resetExam = () => {
    setAnswers({});
    setFinished(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main className="min-h-screen bg-[#fbfcff] text-[#081038]">
      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <section className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 rotate-[-8deg] items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-200">
              <Brain size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight">
                Simulacro
              </h1>

              <p className="hidden text-xs font-bold text-slate-500 sm:block">
                Modo práctica
              </p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft size={17} />
            Dashboard
          </Link>
        </section>
      </nav>

      <section className="mx-auto max-w-5xl px-5 py-8">
        <header className="rounded-[2.2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-black text-indigo-600">
            <Sparkles size={17} />
            Práctica inteligente
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Crea un simulacro
          </h1>

          <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-slate-600">
            Responde preguntas de tus bancos personales y revisa tu resultado
            automáticamente.
          </p>
        </header>

        {loading && (
          <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-xl">
            <p className="font-black text-slate-500">
              Cargando preguntas...
            </p>
          </div>
        )}

        {!loading && questions.length === 0 && (
          <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-xl">
            <h2 className="text-2xl font-black">
              No hay preguntas disponibles
            </h2>

            <p className="mt-3 text-sm font-medium text-slate-500">
              Importa preguntas para comenzar a practicar.
            </p>

            <Link
              href="/importar"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-6 py-4 text-sm font-black text-white shadow-xl shadow-indigo-200"
            >
              <PlayCircle size={18} />
              Importar preguntas
            </Link>
          </div>
        )}

        {finished && questions.length > 0 && (
          <div className="mt-8 rounded-[2rem] bg-gradient-to-r from-indigo-500 to-blue-600 p-8 text-white shadow-2xl shadow-indigo-200">
            <h2 className="text-3xl font-black">Resultado final</h2>

            <p className="mt-3 text-lg font-semibold">
              Obtuviste {score} de {questions.length} respuestas correctas.
            </p>

            <div className="mt-6">
              <button
                onClick={resetExam}
                className="rounded-xl bg-white px-6 py-3 text-sm font-black text-indigo-600 shadow-lg"
              >
                Reiniciar simulacro
              </button>
            </div>
          </div>
        )}

        {!loading && questions.length > 0 && (
          <section className="mt-8 space-y-6">
            {questions.map((question, index) => {
              const userAnswer = answers[question.id];

              return (
                <article
                  key={question.id}
                  className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-600">
                        Pregunta {index + 1}
                      </span>

                      <h2 className="mt-4 text-xl font-black leading-8">
                        {question.question_text}
                      </h2>
                    </div>

                    {question.topic && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                        {question.topic}
                      </span>
                    )}
                  </div>

                  <div className="mt-6 grid gap-3">
                    {[
                      question.option_a,
                      question.option_b,
                      question.option_c,
                      question.option_d,
                      question.option_e,
                    ]
                      .filter(Boolean)
                      .map((option, optionIndex) => {
                        const letters = ["A", "B", "C", "D", "E"];

                        const letter = letters[optionIndex];

                        const isCorrect =
                          finished &&
                          letter === question.correct_answer;

                        const isWrong =
                          finished &&
                          userAnswer === letter &&
                          userAnswer !== question.correct_answer;

                        return (
                          <button
                            key={letter}
                            onClick={() =>
                              !finished &&
                              setAnswers((prev) => ({
                                ...prev,
                                [question.id]: letter,
                              }))
                            }
                            className={`rounded-2xl border px-5 py-4 text-left text-sm font-semibold transition ${
                              userAnswer === letter
                                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                : "border-slate-200 bg-white hover:bg-slate-50"
                            } ${
                              isCorrect
                                ? "!border-emerald-500 !bg-emerald-50"
                                : ""
                            } ${
                              isWrong ? "!border-red-500 !bg-red-50" : ""
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span>
                                <span className="font-black">{letter}.</span>{" "}
                                {option}
                              </span>

                              {isCorrect && (
                                <CheckCircle2
                                  size={20}
                                  className="text-emerald-600"
                                />
                              )}

                              {isWrong && (
                                <XCircle
                                  size={20}
                                  className="text-red-600"
                                />
                              )}
                            </div>
                          </button>
                        );
                      })}
                  </div>

                  {finished && question.explanation && (
                    <div className="mt-5 rounded-2xl bg-slate-50 p-5">
                      <p className="text-sm font-black text-slate-700">
                        Explicación
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {question.explanation}
                      </p>
                    </div>
                  )}
                </article>
              );
            })}

            {!finished && (
              <div className="flex justify-center">
                <button
                  onClick={finishExam}
                  className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-8 py-4 text-sm font-black text-white shadow-2xl shadow-indigo-200 transition hover:scale-[1.02]"
                >
                  <PlayCircle size={18} />
                  Finalizar simulacro
                </button>
              </div>
            )}
          </section>
        )}
      </section>
    </main>
  );
}
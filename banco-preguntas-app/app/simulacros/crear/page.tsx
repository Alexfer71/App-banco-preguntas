"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, PlayCircle, XCircle } from "lucide-react";
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetExam = () => {
    setAnswers({});
    setFinished(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#f8f7ff] px-4 py-6 text-slate-950">
      <section className="mx-auto max-w-5xl space-y-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black shadow"
        >
          <ArrowLeft size={18} />
          Volver al dashboard
        </Link>

        <header className="rounded-[2rem] bg-white/90 p-6 shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-500">
            Práctica
          </p>
          <h1 className="mt-1 flex items-center gap-2 text-3xl font-black">
            <PlayCircle className="text-violet-600" />
            Crear simulacro
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Responde las preguntas y revisa tu calificación al final.
          </p>
        </header>

        {loading && <p className="font-semibold text-slate-500">Cargando...</p>}

        {!loading && questions.length === 0 && (
          <div className="rounded-[2rem] bg-white p-8 text-center shadow-xl">
            <h2 className="text-2xl font-black">No hay preguntas para practicar</h2>
            <Link
              href="/importar"
              className="mt-5 inline-block rounded-full bg-violet-600 px-6 py-3 font-black text-white"
            >
              Importar preguntas
            </Link>
          </div>
        )}

        {finished && questions.length > 0 && (
          <div className="rounded-[2rem] bg-gradient-to-br from-violet-700 via-fuchsia-600 to-orange-400 p-8 text-white shadow-xl">
            <h2 className="text-3xl font-black">Resultado</h2>
            <p className="mt-3 text-xl font-black">
              Sacaste {score} de {questions.length}
            </p>
            <p className="mt-1 text-white/80">
              Nota aproximada: {((score / questions.length) * 10).toFixed(2)} / 10
            </p>

            <button
              onClick={resetExam}
              className="mt-5 rounded-full bg-white px-6 py-3 font-black text-violet-700"
            >
              Repetir simulacro
            </button>
          </div>
        )}

        <section className="space-y-4">
          {questions.map((question, index) => {
            const selected = answers[question.id];
            const isCorrect = selected === question.correct_answer;

            return (
              <article key={question.id} className="rounded-[2rem] bg-white p-6 shadow-xl">
                <p className="text-sm font-black text-violet-600">
                  Pregunta {index + 1}
                </p>

                {question.topic && (
                  <p className="mt-2 inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700">
                    {question.topic}
                  </p>
                )}

                <h2 className="mt-4 text-xl font-black leading-snug">
                  {question.question_text}
                </h2>

                <div className="mt-5 grid gap-3">
                  <AnswerButton
                    label="A"
                    text={question.option_a}
                    selected={selected === "A"}
                    disabled={finished}
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [question.id]: "A" }))
                    }
                  />
                  <AnswerButton
                    label="B"
                    text={question.option_b}
                    selected={selected === "B"}
                    disabled={finished}
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [question.id]: "B" }))
                    }
                  />
                  <AnswerButton
                    label="C"
                    text={question.option_c}
                    selected={selected === "C"}
                    disabled={finished}
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [question.id]: "C" }))
                    }
                  />
                  <AnswerButton
                    label="D"
                    text={question.option_d}
                    selected={selected === "D"}
                    disabled={finished}
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [question.id]: "D" }))
                    }
                  />
                  {question.option_e && (
                    <AnswerButton
                      label="E"
                      text={question.option_e}
                      selected={selected === "E"}
                      disabled={finished}
                      onClick={() =>
                        setAnswers((prev) => ({ ...prev, [question.id]: "E" }))
                      }
                    />
                  )}
                </div>

                {finished && (
                  <div
                    className={`mt-5 rounded-3xl p-4 ${
                      isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    }`}
                  >
                    <p className="flex items-center gap-2 font-black">
                      {isCorrect ? <CheckCircle2 /> : <XCircle />}
                      {isCorrect ? "Correcta" : "Incorrecta"}
                    </p>
                    <p className="mt-2 text-sm font-semibold">
                      Respuesta correcta: {question.correct_answer}
                    </p>
                    {question.explanation && (
                      <p className="mt-2 text-sm">{question.explanation}</p>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </section>

        {!loading && questions.length > 0 && !finished && (
          <button
            onClick={finishExam}
            className="w-full rounded-full bg-slate-950 px-6 py-4 font-black text-white"
          >
            Finalizar simulacro
          </button>
        )}
      </section>
    </main>
  );
}

function AnswerButton({
  label,
  text,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  text: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left font-semibold transition ${
        selected
          ? "border-violet-600 bg-violet-100 text-violet-800"
          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-violet-300"
      }`}
    >
      <span className="font-black">{label}.</span> {text}
    </button>
  );
}
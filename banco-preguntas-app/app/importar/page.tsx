"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import {
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Database,
  FileText,
  Save,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type QuestionRow = {
  pregunta: string;
  opcion_a: string;
  opcion_b: string;
  opcion_c: string;
  opcion_d: string;
  opcion_e?: string;
  respuesta_correcta: string;
  explicacion?: string;
  tema?: string;
};

export default function ImportarPage() {
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankDescription, setBankDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setFileName(file.name);

    const extension = file.name.split(".").pop()?.toLowerCase();

    try {
      if (extension === "csv") {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setQuestions(results.data as QuestionRow[]);
          },
        });
      } else if (extension === "xlsx" || extension === "xls") {
        const data = await file.arrayBuffer();

        const workbook = XLSX.read(data);

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        const jsonData = XLSX.utils.sheet_to_json<QuestionRow>(worksheet);

        setQuestions(jsonData);
      } else {
        setError("Formato no soportado.");
      }
    } catch (err) {
      console.error(err);
      setError("Error al leer el archivo.");
    }
  };

  const saveQuestions = async () => {
    if (!bankName.trim()) {
      setError("Debes colocar un nombre para el banco.");
      return;
    }

    if (questions.length === 0) {
      setError("No hay preguntas para guardar.");
      return;
    }

    setIsSaving(true);
    setError("");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      setError("Debes iniciar sesión.");
      setIsSaving(false);
      return;
    }

    const userId = session.user.id;

    const { data: bankData, error: bankError } = await supabase
      .from("question_banks")
      .insert({
        user_id: userId,
        name: bankName,
        description: bankDescription,
        total_questions: questions.length,
      })
      .select()
      .single();

    if (bankError || !bankData) {
      console.error(bankError);
      setError("Error al crear el banco.");
      setIsSaving(false);
      return;
    }

    const formattedQuestions = questions.map((question) => ({
      user_id: userId,
      bank_id: bankData.id,
      question_text: question.pregunta,
      option_a: question.opcion_a,
      option_b: question.opcion_b,
      option_c: question.opcion_c,
      option_d: question.opcion_d,
      option_e: question.opcion_e || "",
      correct_answer: question.respuesta_correcta,
      explanation: question.explicacion || "",
      topic: question.tema || "",
    }));

    const { error: questionsError } = await supabase
      .from("questions")
      .insert(formattedQuestions);

    if (questionsError) {
      console.error(questionsError);
      setError("Error al guardar preguntas.");
      setIsSaving(false);
      return;
    }

    alert("Banco guardado correctamente.");

    setQuestions([]);
    setFileName("");
    setBankName("");
    setBankDescription("");
    setIsSaving(false);
  };

  return (
    <main className="min-h-screen bg-[#fbfcff] text-[#081038]">
      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <section className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 rotate-[-8deg] items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-200">
              <Database size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight">
                Importar preguntas
              </h1>
              <p className="hidden text-xs font-bold text-slate-500 sm:block">
                Banco de estudio
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

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2.2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-black text-indigo-600">
              <Sparkles size={17} />
              Importación inteligente
            </div>

            <h2 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Importa tus
              <br />
              preguntas fácilmente.
            </h2>

            <p className="mt-5 max-w-xl text-sm font-medium leading-6 text-slate-600 sm:text-base">
              Sube archivos Excel o CSV con tus preguntas y crea bancos
              organizados para practicar con simulacros y flashcards.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <InfoCard
                icon={<FileSpreadsheet size={24} />}
                title="Excel y CSV"
                text="Compatible con formatos .xlsx, .xls y .csv"
                color="bg-blue-100 text-blue-600"
              />

              <InfoCard
                icon={<CheckCircle2 size={24} />}
                title="Vista previa"
                text="Revisa las preguntas antes de guardar."
                color="bg-emerald-100 text-emerald-600"
              />

              <InfoCard
                icon={<Upload size={24} />}
                title="Carga rápida"
                text="Sube cientos de preguntas fácilmente."
                color="bg-violet-100 text-violet-600"
              />

              <InfoCard
                icon={<FileText size={24} />}
                title="Organización"
                text="Clasifica preguntas por temas y bancos."
                color="bg-yellow-100 text-yellow-600"
              />
            </div>
          </div>

          <div className="rounded-[2.2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
            <div className="mb-6">
              <p className="text-sm font-black text-indigo-600">
                Nuevo banco
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight">
                Subir archivo
              </h2>

              <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                Selecciona tu archivo y completa la información del banco.
              </p>
            </div>

            <div className="grid gap-5">
              <label className="grid gap-2">
                <span className="text-sm font-black text-slate-700">
                  Nombre del banco
                </span>

                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Ej: Anatomía, Historia..."
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold outline-none transition focus:border-indigo-400"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black text-slate-700">
                  Descripción
                </span>

                <textarea
                  rows={4}
                  value={bankDescription}
                  onChange={(e) => setBankDescription(e.target.value)}
                  placeholder="Describe este banco de preguntas..."
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold outline-none transition focus:border-indigo-400"
                />
              </label>

              <label className="group cursor-pointer rounded-[2rem] border-2 border-dashed border-indigo-200 bg-indigo-50/40 p-8 text-center transition hover:border-indigo-400 hover:bg-indigo-50">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-200">
                  <Upload size={28} />
                </div>

                <h3 className="mt-5 text-xl font-black">
                  Seleccionar archivo
                </h3>

                <p className="mt-2 text-sm font-medium text-slate-500">
                  Haz clic para subir un archivo Excel o CSV.
                </p>

                {fileName && (
                  <div className="mt-5 rounded-2xl bg-white px-4 py-3 text-sm font-black text-indigo-600 shadow-sm">
                    {fileName}
                  </div>
                )}
              </label>

              {error && (
                <div className="flex items-start gap-3 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}

              {questions.length > 0 && (
                <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
                  Se cargaron correctamente {questions.length} preguntas.
                </div>
              )}

              <button
                onClick={saveQuestions}
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-6 py-4 text-sm font-black text-white shadow-xl shadow-indigo-200 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={18} />

                {isSaving ? "Guardando..." : "Guardar banco"}
              </button>
            </div>
          </div>
        </div>

        {questions.length > 0 && (
          <section className="mt-8 rounded-[2.2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-indigo-600">
                  Vista previa
                </p>

                <h2 className="mt-1 text-3xl font-black tracking-tight">
                  Preguntas detectadas
                </h2>
              </div>

              <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-black text-indigo-600">
                {questions.length} preguntas
              </span>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full overflow-hidden rounded-3xl border border-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-4 text-left text-sm font-black text-slate-700">
                      Pregunta
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-black text-slate-700">
                      Respuesta
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-black text-slate-700">
                      Tema
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {questions.slice(0, 10).map((question, index) => (
                    <tr
                      key={index}
                      className="border-t border-slate-100 bg-white"
                    >
                      <td className="px-5 py-4 text-sm font-medium text-slate-700">
                        {question.pregunta}
                      </td>

                      <td className="px-5 py-4 text-sm font-black text-indigo-600">
                        {question.respuesta_correcta}
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-slate-500">
                        {question.tema || "Sin tema"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
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
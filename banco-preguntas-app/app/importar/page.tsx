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
} from "lucide-react";
import Link from "next/link";

type QuestionRow = {
  pregunta: string;
  opcion_a: string;
  opcion_b: string;
  opcion_c: string;
  opcion_d: string;
  respuesta_correcta: string;
  explicacion?: string;
  tema?: string;
};

export default function ImportarPage() {
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setFileName(file.name);
    setError("");
    setQuestions([]);

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (extension === "xlsx" || extension === "xls") {
      readExcelFile(file);
      return;
    }

    if (extension === "csv") {
      readCsvFile(file);
      return;
    }

    setError("Formato no permitido. Usa un archivo Excel (.xlsx) o CSV.");
  };

  const readExcelFile = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json<QuestionRow>(worksheet, {
        defval: "",
      });

      validateAndSetQuestions(jsonData);
    } catch {
      setError("No se pudo leer el archivo Excel.");
    }
  };

  const readCsvFile = (file: File) => {
    Papa.parse<QuestionRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        validateAndSetQuestions(result.data);
      },
      error: () => {
        setError("No se pudo leer el archivo CSV.");
      },
    });
  };

  const validateAndSetQuestions = (rows: QuestionRow[]) => {
    const cleanedRows = rows.map((row) => ({
      pregunta: String(row.pregunta || "").trim(),
      opcion_a: String(row.opcion_a || "").trim(),
      opcion_b: String(row.opcion_b || "").trim(),
      opcion_c: String(row.opcion_c || "").trim(),
      opcion_d: String(row.opcion_d || "").trim(),
      respuesta_correcta: String(row.respuesta_correcta || "")
        .trim()
        .toUpperCase(),
      explicacion: String(row.explicacion || "").trim(),
      tema: String(row.tema || "").trim(),
    }));

    const validRows = cleanedRows.filter(
      (row) =>
        row.pregunta &&
        row.opcion_a &&
        row.opcion_b &&
        row.opcion_c &&
        row.opcion_d &&
        row.respuesta_correcta
    );

    if (validRows.length === 0) {
      setError(
        "No se encontraron preguntas válidas. Revisa que el archivo tenga las columnas correctas."
      );
      return;
    }

    setQuestions(validRows);
  };

  const incompleteQuestions = questions.filter(
    (question) =>
      !question.pregunta ||
      !question.opcion_a ||
      !question.opcion_b ||
      !question.opcion_c ||
      !question.opcion_d ||
      !question.respuesta_correcta
  ).length;

  return (
    <main className="min-h-screen bg-[#f8f7ff] px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-violet-100/70 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/"
              className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-violet-600 transition hover:text-violet-800"
            >
              <ArrowLeft size={17} />
              Volver al inicio
            </Link>

            <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-500">
              Importador
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight">
              Importar banco de preguntas
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Sube un archivo Excel o CSV con tus preguntas. La app leerá las
              columnas y mostrará una vista previa antes de guardar.
            </p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 p-4 text-white shadow-lg shadow-violet-200">
            <FileSpreadsheet size={34} />
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-xl shadow-slate-200/70 backdrop-blur">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-200">
              <Upload size={30} />
            </div>

            <h2 className="mt-5 text-2xl font-black">Subir archivo</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Por ahora trabajaremos con archivos Excel o CSV. Para que la app
              detecte todo bien, el archivo debe tener columnas con nombres
              específicos.
            </p>

            <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-violet-300 bg-violet-50/70 px-5 py-10 text-center transition hover:bg-violet-100">
              <Upload className="mb-3 text-violet-600" size={34} />
              <span className="font-black text-violet-700">
                Seleccionar archivo
              </span>
              <span className="mt-1 text-xs font-semibold text-slate-500">
                Formatos permitidos: .xlsx, .xls, .csv
              </span>

              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {fileName && (
              <div className="mt-5 rounded-2xl bg-slate-100 p-4 text-sm">
                <p className="font-black text-slate-700">Archivo cargado</p>
                <p className="mt-1 break-all text-slate-500">{fileName}</p>
              </div>
            )}

            {error && (
              <div className="mt-5 flex gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle className="shrink-0" size={20} />
                <p className="font-semibold">{error}</p>
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-xl shadow-slate-200/70 backdrop-blur">
            <h2 className="text-2xl font-black">Formato requerido</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Tu archivo debe tener estas columnas. Es importante respetar los
              nombres para que el importador pueda leer el banco.
            </p>

            <div className="mt-5 overflow-x-auto rounded-3xl border">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-slate-950 text-white">
                  <tr>
                    <th className="px-4 py-3">pregunta</th>
                    <th className="px-4 py-3">opcion_a</th>
                    <th className="px-4 py-3">opcion_b</th>
                    <th className="px-4 py-3">opcion_c</th>
                    <th className="px-4 py-3">opcion_d</th>
                    <th className="px-4 py-3">respuesta_correcta</th>
                    <th className="px-4 py-3">tema</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="px-4 py-3">¿Capital de Ecuador?</td>
                    <td className="px-4 py-3">Quito</td>
                    <td className="px-4 py-3">Guayaquil</td>
                    <td className="px-4 py-3">Cuenca</td>
                    <td className="px-4 py-3">Loja</td>
                    <td className="px-4 py-3 font-black text-emerald-600">
                      A
                    </td>
                    <td className="px-4 py-3">Cultura general</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <InfoBox title="Detectadas" value={questions.length} />
              <InfoBox title="Incompletas" value={incompleteQuestions} />
              <InfoBox
                title="Estado"
                value={questions.length > 0 ? "Listo" : "Pendiente"}
              />
            </div>
          </div>
        </section>

        {questions.length > 0 && (
          <section className="rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-xl shadow-slate-200/70 backdrop-blur">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-700">
                  <CheckCircle2 size={17} />
                  Preguntas detectadas correctamente
                </div>

                <h2 className="text-2xl font-black">Vista previa</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Mostrando las primeras preguntas leídas del archivo.
                </p>
              </div>

              <button className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:scale-[1.02]">
                Guardar banco
              </button>
            </div>

            <div className="overflow-x-auto rounded-3xl border">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-slate-950 text-white">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Pregunta</th>
                    <th className="px-4 py-3">A</th>
                    <th className="px-4 py-3">B</th>
                    <th className="px-4 py-3">C</th>
                    <th className="px-4 py-3">D</th>
                    <th className="px-4 py-3">Correcta</th>
                    <th className="px-4 py-3">Tema</th>
                  </tr>
                </thead>

                <tbody>
                  {questions.slice(0, 20).map((question, index) => (
                    <tr
                      key={`${question.pregunta}-${index}`}
                      className="border-t bg-white"
                    >
                      <td className="px-4 py-3 font-black">{index + 1}</td>
                      <td className="max-w-[320px] px-4 py-3">
                        {question.pregunta}
                      </td>
                      <td className="px-4 py-3">{question.opcion_a}</td>
                      <td className="px-4 py-3">{question.opcion_b}</td>
                      <td className="px-4 py-3">{question.opcion_c}</td>
                      <td className="px-4 py-3">{question.opcion_d}</td>
                      <td className="px-4 py-3 font-black text-emerald-600">
                        {question.respuesta_correcta}
                      </td>
                      <td className="px-4 py-3">{question.tema || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {questions.length > 20 && (
              <p className="mt-4 text-sm font-semibold text-slate-500">
                Se muestran 20 preguntas de {questions.length}. Luego haremos
                una vista completa con paginación.
              </p>
            )}
          </section>
        )}
      </section>
    </main>
  );
}

function InfoBox({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-3xl bg-slate-100 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">
        {title}
      </p>
      <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
    </div>
  );
}
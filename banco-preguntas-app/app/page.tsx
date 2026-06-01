import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  ClipboardList,
  FileQuestion,
  FolderOpen,
  Sparkles,
  Star,
  Upload,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fbfcff] text-[#081038]">
      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <section className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 rotate-[-8deg] items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-200">
              <BookOpen size={24} />
            </div>
            <h1 className="text-2xl font-black tracking-tight">Estudia+</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2 text-sm font-bold text-slate-800 sm:block"
            >
              Iniciar sesión
            </Link>

            <Link
              href="/login"
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-indigo-200 transition hover:scale-[1.02]"
            >
              Regístrate gratis
            </Link>
          </div>
        </section>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-black text-indigo-600">
            <Star size={17} />
            Plataforma para estudiar mejor
          </div>

          <h2 className="text-5xl font-black leading-[1.08] tracking-tight sm:text-6xl">
            Aprende más.
            <br />
            Recuerda{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
              mejor.
            </span>
          </h2>

          <p className="mt-6 max-w-xl text-lg font-medium leading-8 text-slate-600">
            Organiza tus preguntas, crea simulacros y repasa información con
            flashcards. Todo desde un panel sencillo, moderno y adaptable a
            celular, tablet y computadora.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-7 py-4 font-black text-white shadow-xl shadow-indigo-200 transition hover:scale-[1.02]"
            >
              Comenzar gratis
              <ArrowRight size={20} />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-7 py-4 font-black text-slate-900 shadow-sm transition hover:bg-slate-50"
            >
              Iniciar sesión
            </Link>
          </div>

          <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
            <MiniStat value="CSV" label="Importación" />
            <MiniStat value="100%" label="Personal" />
            <MiniStat value="24/7" label="Estudio" />
          </div>
        </div>

        <div className="rounded-[2.2rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-200/80">
          <div className="rounded-[1.8rem] bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-6 sm:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black text-indigo-600">
                    Tu espacio de estudio
                  </p>
                  <h3 className="mt-2 text-3xl font-black tracking-tight">
                    Todo organizado en un solo lugar
                  </h3>
                  <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                    Importa preguntas, crea bancos por tema y repasa datos
                    importantes con tarjetas visuales.
                  </p>
                </div>

                <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-lg sm:flex">
                  <Sparkles size={30} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <PreviewCard
                  icon={<Upload size={24} />}
                  title="Importa bancos"
                  text="Sube preguntas desde archivos Excel o CSV."
                  color="bg-blue-100 text-blue-600"
                />

                <PreviewCard
                  icon={<FileQuestion size={24} />}
                  title="Practica"
                  text="Crea simulacros con tus bancos guardados."
                  color="bg-indigo-100 text-indigo-600"
                />

                <PreviewCard
                  icon={<Brain size={24} />}
                  title="Memoriza"
                  text="Estudia conceptos con flashcards por tema."
                  color="bg-violet-100 text-violet-600"
                />

                <PreviewCard
                  icon={<BarChart3 size={24} />}
                  title="Avanza"
                  text="Lleva un mejor control de tu aprendizaje."
                  color="bg-emerald-100 text-emerald-600"
                />
              </div>

              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-black">Flujo de estudio</p>
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-600">
                    Simple
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <Step number="1" title="Sube" text="Importa tus datos." />
                  <Step number="2" title="Organiza" text="Crea bancos." />
                  <Step number="3" title="Estudia" text="Practica y repasa." />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <h3 className="text-center text-3xl font-black">
          ¿Qué puedes hacer con la plataforma?
        </h3>

        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
          Una herramienta pensada para estudiar de forma más ordenada y rápida.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Feature
            icon={<FileQuestion size={30} />}
            title="Bancos de preguntas"
            text="Guarda preguntas por tema y crea simulacros específicos."
            color="bg-blue-100 text-blue-600"
          />

          <Feature
            icon={<Brain size={30} />}
            title="Flashcards"
            text="Crea tarjetas con información para memorizar conceptos."
            color="bg-violet-100 text-violet-600"
          />

          <Feature
            icon={<FolderOpen size={30} />}
            title="Organización"
            text="Mantén tus materiales separados por bancos y temas."
            color="bg-yellow-100 text-yellow-600"
          />

          <Feature
            icon={<ClipboardList size={30} />}
            title="Simulacros"
            text="Practica con preguntas de tus propios bancos guardados."
            color="bg-emerald-100 text-emerald-600"
          />
        </div>

        <div className="mt-12 overflow-hidden rounded-[2rem] bg-gradient-to-r from-indigo-50 via-blue-50 to-violet-50 p-8 shadow-sm">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-indigo-600 shadow-sm">
                <CheckCircle2 size={17} />
                Listo para estudiar
              </div>

              <h3 className="text-2xl font-black">
                Empieza gratis y organiza tu aprendizaje desde hoy.
              </h3>

              <p className="mt-2 text-slate-600">
                Accede a tu panel, importa tus preguntas y crea flashcards
                personalizadas.
              </p>
            </div>

            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-8 py-4 font-black text-white shadow-xl shadow-indigo-200 transition hover:scale-[1.02]"
            >
              Crear mi cuenta
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xl font-black text-indigo-600">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
    </div>
  );
}

function PreviewCard({
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
    <article className="rounded-3xl bg-white p-5 shadow-sm">
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}>
        {icon}
      </div>
      <h4 className="font-black">{title}</h4>
      <p className="mt-2 text-sm font-medium leading-6 text-slate-500">{text}</p>
    </article>
  );
}

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-black text-white">
        {number}
      </span>
      <h4 className="mt-3 font-black">{title}</h4>
      <p className="mt-1 text-sm font-medium text-slate-500">{text}</p>
    </div>
  );
}

function Feature({
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
    <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${color}`}>
        {icon}
      </div>
      <h4 className="font-black">{title}</h4>
      <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{text}</p>
    </article>
  );
}
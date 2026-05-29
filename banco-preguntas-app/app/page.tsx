import {
  Upload,
  BookOpen,
  ClipboardList,
  BarChart3,
  Layers3,
  PlayCircle,
  Sparkles,
  CheckCircle2,
  FileSpreadsheet,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f7ff] text-slate-950">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-[-120px] top-[-120px] h-72 w-72 rounded-full bg-fuchsia-300/40 blur-3xl" />
        <div className="absolute right-[-120px] top-20 h-80 w-80 rounded-full bg-sky-300/50 blur-3xl" />
        <div className="absolute bottom-[-140px] left-1/3 h-96 w-96 rounded-full bg-amber-200/50 blur-3xl" />
      </div>

      <section className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/75 px-5 py-4 shadow-xl shadow-violet-100/70 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-200">
              <Sparkles size={24} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-500">
                Banco de estudio
              </p>
              <h1 className="text-2xl font-black tracking-tight text-slate-950">
                ExamFlash
              </h1>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button className="rounded-full border border-violet-200 bg-white px-5 py-2.5 text-sm font-bold text-violet-700 transition hover:bg-violet-50">
              Ver demo
            </button>

            <Link
              href="/login"
              className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-2.5 text-center text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:scale-[1.02]"
            >
              Iniciar sesión
            </Link>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-700 via-fuchsia-600 to-orange-400 p-6 text-white shadow-2xl shadow-violet-200 sm:p-8 lg:p-10">
            <div className="absolute right-[-80px] top-[-80px] h-56 w-56 rounded-full bg-white/20 blur-2xl" />
            <div className="absolute bottom-[-100px] left-[-80px] h-72 w-72 rounded-full bg-yellow-200/20 blur-2xl" />

            <div className="relative z-10">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur">
                <FileSpreadsheet size={17} />
                Importa Excel o CSV en segundos
              </div>

              <h2 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Convierte tu banco de preguntas en simulacros y flashcards.
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
                Sube tus 1000 o 1200 preguntas, revisa que estén bien separadas
                y crea simulacros de 160, 200 o la cantidad que necesites.
              </p>

              <Link
                href="/importar"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-violet-700 shadow-lg transition hover:scale-[1.02]"
              >
                <Upload size={18} />
                  Importar banco
              </Link>

                <button className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/15 px-6 py-3 text-sm font-black text-white backdrop-blur transition hover:bg-white/25">
                  <PlayCircle size={18} />
                  Crear simulacro
                </button>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <MiniStat value="1200" label="Preguntas posibles" />
                <MiniStat value="200" label="Preguntas por examen" />
                <MiniStat value="100%" label="Banco personal" />
              </div>
            </div>
        

          <aside className="grid gap-4">
            <SummaryCard
              color="from-sky-500 to-cyan-400"
              title="Preguntas cargadas"
              value="0"
              text="Aún no has importado tu primer banco."
            />

            <SummaryCard
              color="from-emerald-500 to-lime-400"
              title="Simulacros"
              value="0"
              text="Crea exámenes con preguntas aleatorias."
            />

            <SummaryCard
              color="from-amber-500 to-orange-400"
              title="Promedio"
              value="--%"
              text="Aquí aparecerá tu avance."
            />
          </aside>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Upload size={24} />}
            gradient="from-violet-500 to-fuchsia-500"
            title="Importar preguntas"
            description="Carga archivos Excel o CSV y revisa una vista previa antes de guardar."
          />

          <FeatureCard
            icon={<BookOpen size={24} />}
            gradient="from-sky-500 to-cyan-400"
            title="Banco personal"
            description="Cada usuario tendrá sus propios bancos, temas, preguntas y resultados."
          />

          <FeatureCard
            icon={<ClipboardList size={24} />}
            gradient="from-emerald-500 to-lime-400"
            title="Simulacros"
            description="Genera exámenes de 160, 200 o una cantidad personalizada."
          />

          <FeatureCard
            icon={<Layers3 size={24} />}
            gradient="from-amber-500 to-orange-400"
            title="Flashcards"
            description="Repasa tus errores con tarjetas de estudio rápidas y visuales."
          />
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-xl shadow-slate-200/70 backdrop-blur">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-200">
              <Smartphone size={26} />
            </div>

            <h3 className="text-2xl font-black tracking-tight">
              Diseño responsive
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              La interfaz se adapta a celular, tablet y computadora. En pantallas
              pequeñas las tarjetas se apilan; en escritorio se organizan como
              dashboard.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Badge>Celular</Badge>
              <Badge>Tablet</Badge>
              <Badge>Desktop</Badge>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-xl shadow-slate-200/70 backdrop-blur">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-white">
                <BarChart3 size={23} />
              </div>

              <div>
                <h3 className="text-xl font-black">Flujo de la app</h3>
                <p className="text-sm text-slate-500">
                  Primera versión funcional del proyecto.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  title: "Subir archivo",
                  text: "Excel o CSV con preguntas.",
                  color: "bg-violet-100 text-violet-700",
                },
                {
                  title: "Revisar datos",
                  text: "Vista previa editable.",
                  color: "bg-sky-100 text-sky-700",
                },
                {
                  title: "Crear examen",
                  text: "160, 200 o personalizado.",
                  color: "bg-emerald-100 text-emerald-700",
                },
                {
                  title: "Repasar errores",
                  text: "Flashcards automáticas.",
                  color: "bg-orange-100 text-orange-700",
                },
              ].map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-3xl border bg-white p-5 shadow-sm"
                >
                  <span
                    className={`mb-4 flex h-9 w-9 items-center justify-center rounded-full text-sm font-black ${step.color}`}
                  >
                    {index + 1}
                  </span>
                  <h4 className="font-black">{step.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/80 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-300/60 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white">
                <CheckCircle2 size={17} />
                Siguiente módulo
              </div>

              <h3 className="text-3xl font-black tracking-tight">
                Crear pantalla para importar preguntas.
              </h3>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                El siguiente paso será crear una página donde puedas subir un
                archivo, leer sus columnas y mostrar las preguntas en una tabla
                antes de guardarlas.
              </p>
            </div>

            <Link
              href="/importar"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-slate-950 transition hover:scale-[1.02]"
            >
              <Upload size={18} />
              Preparar importador
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-3xl bg-white/15 p-4 backdrop-blur">
      <p className="text-2xl font-black">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-wide text-white/75">
        {label}
      </p>
    </div>
  );
}

function SummaryCard({
  color,
  title,
  value,
  text,
}: {
  color: string;
  title: string;
  value: string;
  text: string;
}) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-xl shadow-slate-200/60 backdrop-blur">
      <div
        className={`mb-5 h-2 rounded-full bg-gradient-to-r ${color}`}
      />

      <p className="text-sm font-bold text-slate-500">{title}</p>
      <p className="mt-2 text-4xl font-black tracking-tight text-slate-950">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </article>
  );
}

function FeatureCard({
  icon,
  gradient,
  title,
  description,
}: {
  icon: React.ReactNode;
  gradient: string;
  title: string;
  description: string;
}) {
  return (
    <article className="group rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl">
      <div
        className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg transition group-hover:scale-110`}
      >
        {icon}
      </div>

      <h3 className="text-lg font-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700">
      {children}
    </span>
  );
}
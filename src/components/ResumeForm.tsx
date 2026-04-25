"use client";

import { useResumeStore } from "@/store/resumeStore";
import { ACCENT_COLORS, FONT_OPTIONS } from "@/types/resume";
import StepPersonalInfo from "./FormSteps/StepPersonalInfo";
import StepSummary from "./FormSteps/StepSummary";
import StepExperience from "./FormSteps/StepExperience";
import StepEducation from "./FormSteps/StepEducation";
import StepSkills from "./FormSteps/StepSkills";

const STEPS = [
  { id: 0, label: "Dados Pessoais", short: "Pessoal",    icon: "👤" },
  { id: 1, label: "Resumo",         short: "Resumo",     icon: "📝" },
  { id: 2, label: "Experiência",    short: "Exp.",       icon: "💼" },
  { id: 3, label: "Educação",       short: "Educação",   icon: "🎓" },
  { id: 4, label: "Habilidades",    short: "Skills",     icon: "⚡" },
];

const TEMPLATES = [
  {
    id:      "classic",
    label:   "Clássico",
    tag:     "🏆 Mais aprovado",
    tagColor:"bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400",
    insight: "Formato Harvard — aprovado por 94% dos recrutadores e reconhecido por 100% dos sistemas ATS. A escolha mais segura para qualquer vaga.",
  },
  {
    id:      "modern",
    label:   "Moderno",
    tag:     "✨ Visual marcante",
    tagColor:"bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400",
    insight: "Cabeçalho com barra de cor e hierarquia visual clara. Ótimo para áreas comerciais, marketing e negócios onde a primeira impressão conta.",
  },
  {
    id:      "minimal",
    label:   "Minimalista",
    tag:     "🤖 Favorito das IAs",
    tagColor:"bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400",
    insight: "Zero ornamentos — só espaço em branco e negrito. Sistemas de triagem automática (ATS) e headhunters adoram: nada atrapalha a leitura do conteúdo.",
  },
  {
    id:      "executive",
    label:   "Executivo",
    tag:     "👔 C-Level & Gestão",
    tagColor:"bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300",
    insight: "Tom refinado, nome em caixa alta e espaçamento generoso. Transmite autoridade — preferido para vagas de liderança, diretoria e C-Level.",
  },
  {
    id:      "creative",
    label:   "Criativo",
    tag:     "🎨 Startups & Design",
    tagColor:"bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400",
    insight: "Destaque sutil na inicial do nome e linhas decorativas leves. Diferenciado sem assustar o robô ATS — ideal para agências, startups e área criativa.",
  },
] as const;

const STEP_COMPONENTS: Record<number, React.ComponentType> = {
  0: StepPersonalInfo,
  1: StepSummary,
  2: StepExperience,
  3: StepEducation,
  4: StepSkills,
};

export default function ResumeForm() {
  const { currentStep, setCurrentStep, maxStepReached, data, updateTemplate, updateAccentColor, updateFont, toggleExecutiveLine } =
    useResumeStore();

  const StepComponent = STEP_COMPONENTS[currentStep];
  const progress = Math.round(((currentStep + 1) / STEPS.length) * 100);

  return (
    <div className="flex h-full flex-col bg-white dark:bg-zinc-900">

      {/* ── Template selector ── */}
      <div className="shrink-0 border-b border-slate-100 dark:border-zinc-800 px-4 py-2.5 space-y-2 md:px-6 md:py-3">
        {/* Template pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          <span className="shrink-0 text-xs font-medium text-slate-400 dark:text-zinc-500">Template:</span>
          {TEMPLATES.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => updateTemplate(id)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition ${
                data.template === id
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Template insight — muda ao selecionar */}
        {(() => {
          const active = TEMPLATES.find((t) => t.id === data.template);
          if (!active) return null;
          return (
            <div className="flex items-start gap-2 rounded-lg bg-slate-50 dark:bg-zinc-800/60 px-3 py-2">
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${active.tagColor}`}>
                {active.tag}
              </span>
              <p className="text-[11px] leading-snug text-slate-500 dark:text-zinc-400">
                {active.insight}
              </p>
            </div>
          );
        })()}

        {/* Divider line toggle — all templates */}
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-xs font-medium text-slate-400 dark:text-zinc-500">Linha:</span>
          <button
            onClick={toggleExecutiveLine}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
              data.executiveLine
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700"
            }`}
          >
            <span>—</span>
            {data.executiveLine ? "Ligada" : "Desligada"}
          </button>
        </div>

        {/* Font row */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="shrink-0 text-xs font-medium text-slate-400 dark:text-zinc-500">Fonte:</span>
          {FONT_OPTIONS.map((f) => (
            <button
              key={f.id}
              onClick={() => updateFont(f.id)}
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium transition ${
                data.fontId === f.id
                  ? "bg-slate-800 dark:bg-zinc-100 text-white dark:text-zinc-900"
                  : "bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700"
              }`}
              style={{ fontFamily: f.css }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Color dots row */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="shrink-0 text-xs font-medium text-slate-400 dark:text-zinc-500">Cor:</span>
          {ACCENT_COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => updateAccentColor(c.value)}
              title={c.label}
              className={`h-5 w-5 shrink-0 rounded-full border-2 transition ${
                data.accentColor === c.value
                  ? "border-slate-700 dark:border-zinc-300 scale-110"
                  : "border-transparent hover:scale-105"
              }`}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="shrink-0 px-4 pt-2.5 pb-1 md:px-6">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs text-slate-400 dark:text-zinc-500">
            Etapa {currentStep + 1} de {STEPS.length}
          </span>
          <span className="text-xs font-semibold text-indigo-600">{progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ── Step tabs — scrollable ── */}
      <div className="shrink-0 flex gap-1 overflow-x-auto px-4 py-2 scrollbar-none md:px-6">
        {STEPS.map((step) => {
          const visited = step.id <= maxStepReached;
          const done    = step.id < currentStep;
          const active  = step.id === currentStep;
          const locked  = step.id > maxStepReached;
          return (
            <button
              key={step.id}
              onClick={() => !locked && setCurrentStep(step.id)}
              disabled={locked}
              title={locked ? "Complete as etapas anteriores primeiro" : step.label}
              className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition md:gap-1.5 md:px-3 ${
                active
                  ? "bg-indigo-600 text-white shadow-sm"
                  : locked
                  ? "cursor-not-allowed text-slate-300 dark:text-zinc-700"
                  : done || visited
                  ? "text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                  : "text-slate-400 dark:text-zinc-500 hover:bg-slate-100 dark:hover:bg-zinc-800"
              }`}
            >
              <span className="text-[11px]">{locked ? "🔒" : done ? "✓" : step.icon}</span>
              <span className="hidden sm:inline">{step.label}</span>
              <span className="sm:hidden">{step.short}</span>
            </button>
          );
        })}
      </div>

      {/* ── Step content ── */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 md:px-6 md:pb-6">
        <h2 className="mb-3 text-base font-semibold text-slate-800 dark:text-zinc-100 md:mb-4 md:text-lg">
          {STEPS[currentStep].icon} {STEPS[currentStep].label}
        </h2>
        <StepComponent />
      </div>

      {/* ── Navigation buttons ── */}
      <div className="shrink-0 flex justify-between border-t border-slate-100 dark:border-zinc-800 px-4 py-3 md:px-6 md:py-4">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-zinc-300 transition hover:bg-slate-100 dark:hover:bg-zinc-800 active:bg-slate-200 disabled:opacity-30 md:py-2"
        >
          ← Anterior
        </button>
        {currentStep < STEPS.length - 1 ? (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 active:bg-indigo-800 md:py-2"
          >
            Próximo →
          </button>
        ) : (
          <div className="flex items-center gap-1.5 rounded-lg bg-green-100 dark:bg-green-950 px-4 py-2.5 text-sm font-semibold text-green-700 dark:text-green-400 md:py-2">
            ✅ Tudo preenchido!
          </div>
        )}
      </div>
    </div>
  );
}

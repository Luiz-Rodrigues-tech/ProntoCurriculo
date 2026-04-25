"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/resumeStore";
import { ResumeData, Experience, Education, ACCENT_COLORS, FONT_OPTIONS } from "@/types/resume";
import CheckoutModal from "./CheckoutModal";

const TEMPLATES = [
  { id: "classic",   label: "Clássico"    },
  { id: "modern",    label: "Moderno"     },
  { id: "minimal",   label: "Minimalista" },
  { id: "executive", label: "Executivo"   },
  { id: "creative",  label: "Criativo"    },
] as const;

/* ─── Shared helpers ─── */

function formatPeriod(start: string, end: string, current: boolean) {
  const fmt = (d: string) => {
    if (!d) return "";
    const [y, m] = d.split("-");
    return `${m}/${y}`;
  };
  const s = fmt(start);
  const e = current ? "Atual" : fmt(end);
  if (!s && !e) return "";
  return [s, e].filter(Boolean).join(" – ");
}

function PhotoCircle({ src, size = 64 }: { src: string; size?: number }) {
  if (!src) return null;
  return (
    <img src={src} alt="Foto" className="rounded-full object-cover shrink-0"
      style={{ width: size, height: size }} />
  );
}

/* ════════════════════════════════════════════════════
   1. CLÁSSICO — Harvard puro
   Coluna única · esquerda · linha fina entre seções
════════════════════════════════════════════════════ */
function ClassicTemplate({ data }: { data: ResumeData }) {
  const { personalInfo: p, summary, experiences, education, skills, accentColor, executiveLine } = data;
  const contacts = [p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean);

  return (
    <div className="min-h-[900px] bg-white px-10 py-9 text-[12.5px] leading-relaxed text-slate-800">

      {/* ── Header ── */}
      <div className="mb-1">
        {p.photo && <div className="mb-3"><PhotoCircle src={p.photo} size={64} /></div>}
        <h1 className="text-[24px] font-bold text-slate-900">
          {p.name || <span className="text-slate-300">Seu Nome</span>}
        </h1>
        {p.jobTitle && <p className="mt-0.5 text-[13px] font-medium text-slate-600">{p.jobTitle}</p>}
        {contacts.length > 0 && (
          <p className="mt-1.5 text-[11px] text-slate-500">{contacts.join("  ·  ")}</p>
        )}
      </div>

      {executiveLine && <div className="my-4" style={{ height: 2, backgroundColor: accentColor }} />}
      {!executiveLine && <div className="my-4 border-t border-slate-300" />}

      {/* ── Sections ── */}
      {summary && (
        <AtsSection title="Resumo Profissional" accent={accentColor}>
          <p className="text-[12px] leading-relaxed text-slate-700">{summary}</p>
        </AtsSection>
      )}
      {!summary && <AtsSection title="Resumo Profissional" accent={accentColor} empty emptyText="Seu resumo aparecerá aqui..." />}

      {experiences.length > 0 ? (
        <AtsSection title="Experiência Profissional" accent={accentColor}>
          {experiences.map((e) => <AtsExp key={e.id} exp={e} />)}
        </AtsSection>
      ) : <AtsSection title="Experiência Profissional" accent={accentColor} empty emptyText="Suas experiências aparecerão aqui..." />}

      {education.length > 0 ? (
        <AtsSection title="Formação Acadêmica" accent={accentColor}>
          {education.map((e) => <AtsEdu key={e.id} edu={e} />)}
        </AtsSection>
      ) : <AtsSection title="Formação Acadêmica" accent={accentColor} empty emptyText="Sua formação aparecerá aqui..." />}

      {skills.length > 0 ? (
        <AtsSection title="Habilidades e Competências" accent={accentColor}>
          <p className="text-[12px] text-slate-700">{skills.join("  ·  ")}</p>
        </AtsSection>
      ) : <AtsSection title="Habilidades e Competências" accent={accentColor} empty emptyText="Suas habilidades aparecerão aqui..." />}
    </div>
  );
}

/* ════════════════════════════════════════════════════
   2. MODERNO — Barra topo fina · coluna única limpa
   Sem bloco colorido · ATS-safe
════════════════════════════════════════════════════ */
function ModernTemplate({ data }: { data: ResumeData }) {
  const { personalInfo: p, summary, experiences, education, skills, accentColor, executiveLine } = data;
  const contacts = [p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean);

  return (
    <div className="min-h-[900px] bg-white text-[12.5px] leading-relaxed text-slate-800">

      {/* ── Header ── */}
      <div className="px-10 pt-8 pb-4">
        <div className="flex items-center gap-5">
          {p.photo && <PhotoCircle src={p.photo} size={68} />}
          <div className="flex-1">
            <h1 className="text-[26px] font-extrabold leading-tight text-slate-900">
              {p.name || <span className="text-slate-300">Seu Nome</span>}
            </h1>
            {p.jobTitle && (
              <p className="mt-0.5 text-[13px] font-semibold" style={{ color: accentColor }}>{p.jobTitle}</p>
            )}
            {contacts.length > 0 && (
              <p className="mt-2 text-[11px] text-slate-500">{contacts.join("  ·  ")}</p>
            )}
          </div>
        </div>
      </div>

      {executiveLine
        ? <div className="mx-10 mb-5" style={{ height: 1.5, backgroundColor: accentColor }} />
        : <div className="mx-10 mb-5 border-t border-slate-200" />
      }

      {/* ── Body — single column ── */}
      <div className="px-10 pb-7">
        {summary ? (
          <ModernSection title="Resumo" accent={accentColor}>
            <p className="text-[12px] leading-relaxed text-slate-700">{summary}</p>
          </ModernSection>
        ) : <ModernSection title="Resumo" accent={accentColor} empty emptyText="Seu resumo aparecerá aqui..." />}

        {experiences.length > 0 ? (
          <ModernSection title="Experiência Profissional" accent={accentColor}>
            {experiences.map((e) => <AtsExp key={e.id} exp={e} accent={accentColor} />)}
          </ModernSection>
        ) : <ModernSection title="Experiência Profissional" accent={accentColor} empty emptyText="Suas experiências aparecerão aqui..." />}

        {education.length > 0 ? (
          <ModernSection title="Formação Acadêmica" accent={accentColor}>
            {education.map((e) => <AtsEdu key={e.id} edu={e} />)}
          </ModernSection>
        ) : <ModernSection title="Formação Acadêmica" accent={accentColor} empty emptyText="Sua formação aparecerá aqui..." />}

        {skills.length > 0 ? (
          <ModernSection title="Habilidades e Competências" accent={accentColor}>
            <p className="text-[12px] text-slate-700">{skills.join("  ·  ")}</p>
          </ModernSection>
        ) : <ModernSection title="Habilidades e Competências" accent={accentColor} empty emptyText="Suas habilidades aparecerão aqui..." />}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   3. MINIMALISTA — Ultra limpo · só tipografia
   Zero decoração · máxima legibilidade
════════════════════════════════════════════════════ */
function MinimalTemplate({ data }: { data: ResumeData }) {
  const { personalInfo: p, summary, experiences, education, skills, accentColor, executiveLine } = data;
  const contacts = [p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean);

  return (
    <div className="min-h-[900px] bg-white px-10 py-9 text-[12.5px] leading-relaxed text-slate-800">

      {/* ── Header ── */}
      <div className="mb-4">
        {p.photo && <div className="mb-3"><PhotoCircle src={p.photo} size={64} /></div>}
        <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">
          {p.name || <span className="text-slate-300">Seu Nome</span>}
        </h1>
        {p.jobTitle && (
          <p className="mt-0.5 text-[12px] uppercase tracking-widest font-medium" style={{ color: accentColor }}>
            {p.jobTitle}
          </p>
        )}
        {contacts.length > 0 && (
          <p className="mt-2 text-[11px] text-slate-500">{contacts.join("   |   ")}</p>
        )}
      </div>

      {executiveLine
        ? <div className="mb-5" style={{ height: 2, backgroundColor: accentColor }} />
        : <div className="mb-5 border-t border-slate-200" />
      }

      {/* ── Sections ── */}
      {summary ? (
        <MinSection title="Resumo">
          <p className="text-[12px] leading-relaxed text-slate-700">{summary}</p>
        </MinSection>
      ) : <MinSection title="Resumo" empty emptyText="Seu resumo aparecerá aqui..." />}

      {experiences.length > 0 ? (
        <MinSection title="Experiência">
          {experiences.map((e) => <AtsExp key={e.id} exp={e} />)}
        </MinSection>
      ) : <MinSection title="Experiência" empty emptyText="Suas experiências aparecerão aqui..." />}

      {education.length > 0 ? (
        <MinSection title="Formação">
          {education.map((e) => <AtsEdu key={e.id} edu={e} />)}
        </MinSection>
      ) : <MinSection title="Formação" empty emptyText="Sua formação aparecerá aqui..." />}

      {skills.length > 0 ? (
        <MinSection title="Habilidades">
          <p className="text-[12px] text-slate-700">{skills.join("   |   ")}</p>
        </MinSection>
      ) : <MinSection title="Habilidades" empty emptyText="Suas habilidades aparecerão aqui..." />}
    </div>
  );
}

/* ════════════════════════════════════════════════════
   4. EXECUTIVO — Refinado · linhas finas · espaçado
   Ideal para liderança e alta gestão
════════════════════════════════════════════════════ */
function ExecutiveTemplate({ data }: { data: ResumeData }) {
  const { personalInfo: p, summary, experiences, education, skills, accentColor, executiveLine } = data;
  const contacts = [p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean);

  return (
    <div className="min-h-[900px] bg-white px-10 py-9 text-[12.5px] leading-relaxed text-slate-800">

      {/* ── Header ── */}
      <div className="mb-6">
        {p.photo && <div className="mb-4"><PhotoCircle src={p.photo} size={72} /></div>}
        <h1 className="text-[24px] font-extrabold uppercase text-slate-900" style={{ letterSpacing: "0.08em" }}>
          {p.name || <span className="text-slate-300">Seu Nome</span>}
        </h1>
        {p.jobTitle && (
          <p className="mt-2 text-[11px] font-medium uppercase tracking-widest" style={{ color: accentColor }}>
            {p.jobTitle}
          </p>
        )}
        {contacts.length > 0 && (
          <p className="mt-3 text-[11px] text-slate-500">{contacts.join("   ·   ")}</p>
        )}
      </div>

      {executiveLine && <div className="mb-6" style={{ height: 2, backgroundColor: accentColor }} />}
      {!executiveLine && <div className="mb-6 border-t border-slate-200" />}

      {summary ? (
        <ExecSection title="Resumo Profissional" accent={accentColor}>
          <p className="text-[12px] leading-relaxed text-slate-700">{summary}</p>
        </ExecSection>
      ) : <ExecSection title="Resumo Profissional" accent={accentColor} empty emptyText="Seu resumo aparecerá aqui..." />}

      {experiences.length > 0 ? (
        <ExecSection title="Experiência Profissional" accent={accentColor}>
          {experiences.map((e) => <AtsExp key={e.id} exp={e} accent={accentColor} />)}
        </ExecSection>
      ) : <ExecSection title="Experiência Profissional" accent={accentColor} empty emptyText="Suas experiências aparecerão aqui..." />}

      {education.length > 0 ? (
        <ExecSection title="Formação Acadêmica" accent={accentColor}>
          {education.map((e) => <AtsEdu key={e.id} edu={e} />)}
        </ExecSection>
      ) : <ExecSection title="Formação Acadêmica" accent={accentColor} empty emptyText="Sua formação aparecerá aqui..." />}

      {skills.length > 0 ? (
        <ExecSection title="Habilidades" accent={accentColor}>
          <p className="text-[12px] text-slate-700">{skills.join("   ·   ")}</p>
        </ExecSection>
      ) : <ExecSection title="Habilidades" accent={accentColor} empty emptyText="Suas habilidades aparecerão aqui..." />}
    </div>
  );
}

/* ════════════════════════════════════════════════════
   5. CRIATIVO — Destaque no nome · coluna única limpa
   Sem barras/caixas · ATS-safe
════════════════════════════════════════════════════ */
function CreativeTemplate({ data }: { data: ResumeData }) {
  const { personalInfo: p, summary, experiences, education, skills, accentColor, executiveLine } = data;
  const contacts = [p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean);

  return (
    <div className="min-h-[900px] bg-white px-10 py-9 text-[12.5px] leading-relaxed text-slate-800">

      {/* ── Header limpo ── */}
      <div className="mb-1">
        {p.photo && <div className="mb-3"><PhotoCircle src={p.photo} size={68} /></div>}
        {/* Nome com initial letter em cor de destaque */}
        <h1 className="text-[26px] font-extrabold text-slate-900 leading-tight">
          {p.name
            ? <>
                <span style={{ color: accentColor }}>{p.name.charAt(0)}</span>{p.name.slice(1)}
              </>
            : <span className="text-slate-300">Seu Nome</span>
          }
        </h1>
        {p.jobTitle && (
          <p className="mt-0.5 text-[12.5px] font-semibold text-slate-600">{p.jobTitle}</p>
        )}
        {contacts.length > 0 && (
          <p className="mt-2 text-[11px] text-slate-500">{contacts.join("  ·  ")}</p>
        )}
      </div>

      {executiveLine
        ? <div className="my-4" style={{ height: 2, backgroundColor: accentColor }} />
        : <div className="my-4 border-t border-slate-300" />
      }

      {/* ── Body ── */}
      {summary ? (
        <CrSection title="Resumo" accent={accentColor}>
          <p className="text-[12px] leading-relaxed text-slate-700">{summary}</p>
        </CrSection>
      ) : <CrSection title="Resumo" accent={accentColor} empty emptyText="Seu resumo aparecerá aqui..." />}

      {experiences.length > 0 ? (
        <CrSection title="Experiência Profissional" accent={accentColor}>
          {experiences.map((e) => <AtsExp key={e.id} exp={e} accent={accentColor} />)}
        </CrSection>
      ) : <CrSection title="Experiência Profissional" accent={accentColor} empty emptyText="Suas experiências aparecerão aqui..." />}

      {education.length > 0 ? (
        <CrSection title="Formação Acadêmica" accent={accentColor}>
          {education.map((e) => <AtsEdu key={e.id} edu={e} />)}
        </CrSection>
      ) : <CrSection title="Formação Acadêmica" accent={accentColor} empty emptyText="Sua formação aparecerá aqui..." />}

      {skills.length > 0 ? (
        <CrSection title="Habilidades e Competências" accent={accentColor}>
          <p className="text-[12px] text-slate-700">{skills.join("  ·  ")}</p>
        </CrSection>
      ) : <CrSection title="Habilidades e Competências" accent={accentColor} empty emptyText="Suas habilidades aparecerão aqui..." />}
    </div>
  );
}

/* ─── Shared section/block components ─── */

/** Clássico — título bold + linha fina */
function AtsSection({ title, accent, empty, emptyText, children }: {
  title: string; accent: string; empty?: boolean; emptyText?: string; children?: React.ReactNode;
}) {
  return (
    <section className="mb-5">
      <h2
        className="mb-2 pb-0.5 text-[10.5px] font-bold uppercase tracking-widest border-b"
        style={empty ? { color: "#cbd5e1", borderColor: "#e2e8f0" } : { color: accent, borderColor: accent }}
      >
        {title}
      </h2>
      {empty ? <p className="text-[11.5px] text-slate-300">{emptyText}</p> : children}
    </section>
  );
}

/** Moderno — título colorido com underline fino, sem fundo */
function ModernSection({ title, accent, empty, emptyText, children }: {
  title: string; accent: string; empty?: boolean; emptyText?: string; children?: React.ReactNode;
}) {
  return (
    <section className="mb-5">
      <h2
        className="mb-2 pb-0.5 text-[10.5px] font-bold uppercase tracking-widest border-b"
        style={empty ? { color: "#cbd5e1", borderColor: "#e2e8f0" } : { color: accent, borderColor: accent + "55" }}
      >
        {title}
      </h2>
      {empty ? <p className="text-[11.5px] text-slate-300">{emptyText}</p> : children}
    </section>
  );
}

/** Minimalista — título simples sem decoração */
function MinSection({ title, empty, emptyText, children }: {
  title: string; empty?: boolean; emptyText?: string; children?: React.ReactNode;
}) {
  return (
    <section className="mb-5">
      <h2 className={`mb-2 text-[11px] font-bold uppercase tracking-widest ${empty ? "text-slate-300" : "text-slate-500"}`}>
        {title}
      </h2>
      {empty ? <p className="text-[11.5px] text-slate-300">{emptyText}</p> : children}
    </section>
  );
}

/** Executivo — título com linha fina abaixo */
function ExecSection({ title, accent, empty, emptyText, children }: {
  title: string; accent: string; empty?: boolean; emptyText?: string; children?: React.ReactNode;
}) {
  return (
    <section className="mb-6">
      <h2
        className="mb-3 text-[11px] font-extrabold uppercase tracking-widest border-b pb-1"
        style={empty ? { color: "#cbd5e1", borderColor: "#e2e8f0" } : { color: "rgb(30,41,59)", borderColor: accent + "88" }}
      >
        {title}
      </h2>
      {empty ? <p className="text-[11.5px] text-slate-300">{emptyText}</p> : children}
    </section>
  );
}

/** Criativo — título limpo, sem barra lateral */
function CrSection({ title, accent, empty, emptyText, children }: {
  title: string; accent: string; empty?: boolean; emptyText?: string; children?: React.ReactNode;
}) {
  return (
    <section className="mb-5">
      <h2
        className="mb-2 pb-0.5 text-[10.5px] font-bold uppercase tracking-widest border-b"
        style={empty ? { color: "#cbd5e1", borderColor: "#e2e8f0" } : { color: accent, borderColor: accent + "44" }}
      >
        {title}
      </h2>
      {empty ? <p className="text-[11.5px] text-slate-300">{emptyText}</p> : children}
    </section>
  );
}

/** Experiência — compartilhado por todos */
function AtsExp({ exp, accent }: { exp: Experience; accent?: string }) {
  const period = formatPeriod(exp.startDate, exp.endDate, exp.current);
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-bold text-[12.5px] text-slate-900">{exp.role}</span>
        {period && <span className="shrink-0 text-[11px] text-slate-400">{period}</span>}
      </div>
      <p className="text-[11.5px] font-semibold" style={{ color: accent ?? "#64748b" }}>{exp.company}</p>
      {exp.description && (
        <p className="mt-1 text-[11.5px] leading-relaxed text-slate-600">{exp.description}</p>
      )}
    </div>
  );
}

/** Educação — compartilhado por todos */
function AtsEdu({ edu }: { edu: Education }) {
  const period = formatPeriod(edu.startDate, edu.endDate, false);
  const title = [edu.degree, edu.field].filter(Boolean).join(" em ");
  return (
    <div className="mb-2 last:mb-0">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-bold text-[12.5px] text-slate-900">{title || "Graduação"}</span>
        {period && <span className="shrink-0 text-[11px] text-slate-400">{period}</span>}
      </div>
      <p className="text-[11.5px] text-slate-500">{edu.institution}</p>
    </div>
  );
}

/* ─── Watermark ─── */
function Watermark() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      <p className="select-none text-5xl font-black uppercase text-slate-200 opacity-40"
        style={{ transform: "rotate(-30deg)", letterSpacing: "0.2em" }}>
        PRÉVIA
      </p>
    </div>
  );
}

const STEPS = [
  { id: 0, label: "Dados Pessoais" },
  { id: 1, label: "Resumo"         },
  { id: 2, label: "Experiência"    },
  { id: 3, label: "Educação"       },
  { id: 4, label: "Habilidades"    },
];

/* ─── Main Export ─── */
export default function ResumePreview({ onDownloadClick }: { onDownloadClick?: () => void }) {
  const { data, updateTemplate, updateAccentColor, updateFont, maxStepReached, allStepsDone, setCurrentStep } = useResumeStore();
  const [showModal, setShowModal] = useState(false);
  const fontOption = FONT_OPTIONS.find((f) => f.id === data.fontId) ?? FONT_OPTIONS[0];

  const handleDownload = () => {
    if (onDownloadClick) onDownloadClick();
    else setShowModal(true);
  };

  return (
    <div className="flex h-full flex-col bg-slate-100 dark:bg-zinc-950">

      {/* ── Desktop header ── */}
      <div className="hidden shrink-0 items-center justify-between border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-3 md:flex">
        <span className="text-sm font-medium text-slate-600 dark:text-zinc-400">Pré-visualização em tempo real</span>
        <span className="rounded-full bg-amber-100 dark:bg-amber-950 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
          Versão com marca d&apos;água
        </span>
      </div>

      {/* ── Mobile controls ── */}
      <div className="shrink-0 space-y-2 border-b border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2.5 md:hidden">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="shrink-0 text-[11px] font-medium text-slate-400 dark:text-zinc-500">Template:</span>
          {TEMPLATES.map(({ id, label }) => (
            <button key={id} onClick={() => updateTemplate(id)}
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition ${
                data.template === id ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400"
              }`}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="shrink-0 text-[11px] font-medium text-slate-400 dark:text-zinc-500">Fonte:</span>
          {FONT_OPTIONS.map((f) => (
            <button key={f.id} onClick={() => updateFont(f.id)}
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition ${
                data.fontId === f.id ? "bg-slate-800 dark:bg-zinc-100 text-white dark:text-zinc-900"
                  : "bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400"
              }`} style={{ fontFamily: f.css }}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="shrink-0 text-[11px] font-medium text-slate-400 dark:text-zinc-500">Cor:</span>
          <div className="flex shrink-0 items-center gap-1.5">
            {ACCENT_COLORS.map((c) => (
              <button key={c.value} onClick={() => updateAccentColor(c.value)} title={c.label}
                className={`h-5 w-5 shrink-0 rounded-full border-2 transition ${
                  data.accentColor === c.value ? "border-slate-700 dark:border-zinc-300 scale-110" : "border-transparent"
                }`} style={{ backgroundColor: c.value }} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Resume canvas ── */}
      <div className="relative flex-1 overflow-y-auto p-3 bg-slate-100 dark:bg-zinc-950 md:p-6">
        <div className="relative mx-auto max-w-[650px] shadow-xl ring-1 ring-slate-200"
          style={{ fontFamily: fontOption.css }}>
          <Watermark />
          {data.template === "classic"   && <ClassicTemplate   data={data} />}
          {data.template === "modern"    && <ModernTemplate    data={data} />}
          {data.template === "minimal"   && <MinimalTemplate   data={data} />}
          {data.template === "executive" && <ExecutiveTemplate data={data} />}
          {data.template === "creative"  && <CreativeTemplate  data={data} />}
        </div>
      </div>

      {/* ── Download area ── */}
      <div className="shrink-0 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 md:px-6 md:py-4">
        {allStepsDone ? (
          <>
            <p className="mb-2.5 hidden text-center text-xs text-slate-500 dark:text-zinc-400 md:block">
              Currículo pronto! Remova a marca d&apos;água e baixe em alta resolução.
            </p>
            <button onClick={handleDownload}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 py-3 text-sm font-bold text-white shadow-lg shadow-green-200 transition hover:from-green-600 hover:to-emerald-700 active:scale-95 md:py-3.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              Baixar PDF — R$&nbsp;9,90
            </button>
          </>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500 dark:text-zinc-400">
                Complete todas as etapas para liberar o download
              </p>
              <span className="text-xs font-semibold text-indigo-600">
                {maxStepReached + 1}/{STEPS.length}
              </span>
            </div>
            <div className="flex gap-1.5">
              {STEPS.map((s) => {
                const done   = maxStepReached >= s.id;
                const active = maxStepReached === s.id;
                return (
                  <button key={s.id} title={s.label} onClick={() => setCurrentStep(s.id)}
                    className={`h-2 flex-1 rounded-full transition-all ${
                      done ? active ? "bg-indigo-600" : "bg-indigo-400" : "bg-slate-300 dark:bg-zinc-600"
                    }`} />
                );
              })}
            </div>
            {(() => {
              const nextStep = STEPS.find((s) => s.id > maxStepReached);
              return nextStep ? (
                <button onClick={() => setCurrentStep(nextStep.id)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-400 dark:border-indigo-500 py-2.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 transition hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 active:scale-95">
                  Ir para: {nextStep.label} →
                </button>
              ) : null;
            })()}
          </div>
        )}
      </div>

      {showModal && <CheckoutModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

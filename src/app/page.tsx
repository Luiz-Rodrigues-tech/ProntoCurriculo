"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/* ── Theme hook (persisted in localStorage) ── */
function useTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("pc-theme");
    if (stored === "dark") setDark(true);
  }, []);

  const toggle = () =>
    setDark((d) => {
      localStorage.setItem("pc-theme", d ? "light" : "dark");
      return !d;
    });

  return { dark, toggle };
}

/* ── Mock app screenshot ── */
function AppMockup({ dark }: { dark: boolean }) {
  const bg = dark ? "#18181b" : "#f8fafc";
  const card = dark ? "#27272a" : "#ffffff";
  const border = dark ? "#3f3f46" : "#e2e8f0";
  const text = dark ? "#f4f4f5" : "#1e293b";
  const muted = dark ? "#71717a" : "#94a3b8";
  const inputBg = dark ? "#3f3f46" : "#f1f5f9";

  return (
    <div
      className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-2xl shadow-2xl"
      style={{ border: `1px solid ${border}` }}
    >
      {/* Browser chrome */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ background: dark ? "#09090b" : "#f1f5f9", borderBottom: `1px solid ${border}` }}
      >
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-400" />
          <div className="h-3 w-3 rounded-full bg-yellow-400" />
          <div className="h-3 w-3 rounded-full bg-green-400" />
        </div>
        <div
          className="mx-auto flex-1 max-w-xs rounded-md px-3 py-1 text-center text-xs"
          style={{ background: dark ? "#27272a" : "#fff", color: muted }}
        >
          prontocurriculo.com.br/criar
        </div>
      </div>

      {/* App layout */}
      <div className="grid grid-cols-2" style={{ background: bg, minHeight: 300 }}>
        {/* Left: form panel */}
        <div className="flex flex-col gap-3 p-5" style={{ borderRight: `1px solid ${border}` }}>
          <div className="text-xs font-bold" style={{ color: "#6366f1" }}>
            👤 Dados Pessoais
          </div>
          {[
            { label: "Nome completo", value: "João da Silva" },
            { label: "Cargo", value: "Dev Full Stack" },
            { label: "E-mail", value: "joao@email.com" },
          ].map((f) => (
            <div key={f.label}>
              <div className="mb-1 text-[10px]" style={{ color: muted }}>
                {f.label}
              </div>
              <div
                className="w-full rounded-lg px-2 py-1.5 text-[11px]"
                style={{ background: inputBg, color: text, border: `1px solid ${border}` }}
              >
                {f.value}
              </div>
            </div>
          ))}
          {/* Steps indicator */}
          <div className="mt-auto flex gap-1 pt-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className="h-1.5 flex-1 rounded-full"
                style={{ background: s <= 1 ? "#6366f1" : border }}
              />
            ))}
          </div>
          <div
            className="w-full rounded-lg py-2 text-center text-xs font-bold text-white"
            style={{ background: "#6366f1" }}
          >
            Próximo →
          </div>
        </div>

        {/* Right: resume preview */}
        <div className="flex flex-col p-4" style={{ background: dark ? "#09090b" : "#e2e8f0" }}>
          <div className="text-[9px] font-semibold uppercase tracking-wider mb-2" style={{ color: muted }}>
            PRÉVIA
          </div>
          <div
            className="flex-1 rounded-lg p-4 text-[9px] shadow-sm"
            style={{ background: card, color: text }}
          >
            <div className="mb-2 border-b pb-2" style={{ borderColor: border }}>
              <div className="text-sm font-extrabold" style={{ color: text }}>
                João da Silva
              </div>
              <div style={{ color: "#6366f1" }}>Dev Full Stack</div>
              <div className="flex gap-2 mt-1" style={{ color: muted }}>
                <span>joao@email.com</span>
                <span>São Paulo, SP</span>
              </div>
            </div>
            {["RESUMO PROFISSIONAL", "EXPERIÊNCIA", "EDUCAÇÃO"].map((s) => (
              <div key={s} className="mb-2">
                <div className="text-[7px] font-bold uppercase tracking-widest mb-1" style={{ color: muted }}>
                  {s}
                </div>
                <div className="space-y-1">
                  {[95, 70, 80].map((w) => (
                    <div
                      key={w}
                      className="h-1 rounded"
                      style={{ width: `${w}%`, background: border }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ background: dark ? "#09090b" : "#f1f5f9", borderTop: `1px solid ${border}` }}
      >
        <span className="text-xs" style={{ color: muted }}>
          ✅ Tudo preenchido!
        </span>
        <div
          className="rounded-xl px-4 py-1.5 text-xs font-bold text-white"
          style={{ background: "#22c55e" }}
        >
          📥 Baixar PDF — R$ 9,90
        </div>
      </div>
    </div>
  );
}

/* ── Resume mini cards — um por template ── */

const SECTION_ROWS = [
  { label: "RESUMO",     lines: [92, 78, 60] },
  { label: "EXPERIÊNCIA", lines: [85, 70] },
  { label: "HABILIDADES", lines: [95] },
];

/** Clássico: Harvard puro — underline colorido nos títulos */
function CardClassic({ color }: { color: string }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-slate-100 text-[7px]" style={{ minHeight: 160 }}>
      <div className="px-3 pt-3 pb-1">
        <div className="text-[11px] font-extrabold text-slate-900 leading-tight">Ana Souza</div>
        <div className="text-[7.5px] font-semibold mt-0.5" style={{ color }}>Gerente de Projetos</div>
        <div className="text-[6.5px] text-slate-400 mt-1">ana@email.com · São Paulo, SP</div>
      </div>
      <div className="mx-3 mb-2" style={{ height: 1.5, backgroundColor: color }} />
      <div className="px-3 pb-3 space-y-2">
        {SECTION_ROWS.map(({ label, lines }) => (
          <div key={label}>
            <div className="text-[6px] font-bold uppercase tracking-widest pb-0.5 mb-1 border-b" style={{ color, borderColor: color }}>
              {label}
            </div>
            <div className="space-y-0.5">
              {lines.map((w) => <div key={w} className="h-1 rounded bg-slate-200" style={{ width: `${w}%` }} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Moderno: barra fina no topo + underline nas seções */
function CardModern({ color }: { color: string }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-slate-100 text-[7px]" style={{ minHeight: 160 }}>
      <div style={{ height: 3, backgroundColor: color }} />
      <div className="px-3 pt-2.5 pb-1">
        <div className="text-[11px] font-extrabold text-slate-900 leading-tight">Carlos Lima</div>
        <div className="text-[7.5px] font-semibold mt-0.5" style={{ color }}>Dev Full Stack</div>
        <div className="text-[6.5px] text-slate-400 mt-1">carlos@email.com · Rio de Janeiro</div>
      </div>
      <div className="mx-3 mb-2" style={{ height: 1, backgroundColor: color + "55" }} />
      <div className="px-3 pb-3 space-y-2">
        {SECTION_ROWS.map(({ label, lines }) => (
          <div key={label}>
            <div className="text-[6px] font-bold uppercase tracking-widest pb-0.5 mb-1 border-b" style={{ color, borderColor: color + "66" }}>
              {label}
            </div>
            <div className="space-y-0.5">
              {lines.map((w) => <div key={w} className="h-1 rounded bg-slate-200" style={{ width: `${w}%` }} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Minimalista: zero ornamento — só tipografia */
function CardMinimal({ color }: { color: string }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-slate-100 text-[7px]" style={{ minHeight: 160 }}>
      <div className="px-3 pt-3 pb-1">
        <div className="text-[11px] font-extrabold text-slate-900 leading-tight tracking-tight">Mariana Costa</div>
        <div className="text-[6.5px] font-medium uppercase tracking-widest mt-0.5" style={{ color }}>UX Designer</div>
        <div className="text-[6px] text-slate-400 mt-1">mari@email.com  |  Porto Alegre</div>
      </div>
      <div className="mx-3 mb-2 border-t border-slate-200" />
      <div className="px-3 pb-3 space-y-2">
        {SECTION_ROWS.map(({ label, lines }) => (
          <div key={label}>
            <div className="text-[6px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</div>
            <div className="space-y-0.5">
              {lines.map((w) => <div key={w} className="h-1 rounded bg-slate-200" style={{ width: `${w}%` }} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Executivo: nome em caixa alta, underline nas seções */
function CardExecutive({ color }: { color: string }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-slate-100 text-[7px]" style={{ minHeight: 160 }}>
      <div className="px-3 pt-3 pb-1">
        <div className="text-[9px] font-extrabold uppercase tracking-wide text-slate-900 leading-tight" style={{ letterSpacing: "0.06em" }}>
          Roberto Alves
        </div>
        <div className="text-[6px] font-medium uppercase tracking-widest mt-1" style={{ color }}>Diretor Comercial</div>
        <div className="text-[6px] text-slate-400 mt-1.5">roberto@corp.com.br · Brasília, DF</div>
      </div>
      <div className="mx-3 mb-2" style={{ height: 1.5, backgroundColor: color }} />
      <div className="px-3 pb-3 space-y-2">
        {SECTION_ROWS.map(({ label, lines }) => (
          <div key={label}>
            <div className="text-[6px] font-extrabold uppercase tracking-widest pb-0.5 mb-1 border-b text-slate-800" style={{ borderColor: color + "88" }}>
              {label}
            </div>
            <div className="space-y-0.5">
              {lines.map((w) => <div key={w} className="h-1 rounded bg-slate-200" style={{ width: `${w}%` }} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Criativo: inicial do nome colorida */
function CardCreative({ color }: { color: string }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-slate-100 text-[7px]" style={{ minHeight: 160 }}>
      <div className="px-3 pt-3 pb-1">
        <div className="text-[11px] font-extrabold text-slate-900 leading-tight">
          <span style={{ color }}>F</span>ernanda Brito
        </div>
        <div className="text-[7.5px] font-semibold text-slate-600 mt-0.5">Motion Designer</div>
        <div className="text-[6.5px] text-slate-400 mt-1">fe@studio.io · Curitiba, PR</div>
      </div>
      <div className="mx-3 mb-2" style={{ height: 1.5, backgroundColor: color }} />
      <div className="px-3 pb-3 space-y-2">
        {SECTION_ROWS.map(({ label, lines }) => (
          <div key={label}>
            <div className="text-[6px] font-bold uppercase tracking-widest pb-0.5 mb-1 border-b" style={{ color, borderColor: color + "55" }}>
              {label}
            </div>
            <div className="space-y-0.5">
              {lines.map((w) => <div key={w} className="h-1 rounded bg-slate-200" style={{ width: `${w}%` }} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function Nav({ dark, toggle }: { dark: boolean; toggle: () => void }) {
  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-sm"
      style={{
        borderBottom: `1px solid ${dark ? "#27272a" : "#e2e8f0"}`,
        background: dark ? "rgba(9,9,11,0.9)" : "rgba(255,255,255,0.9)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📄</span>
          <span
            className="text-xl font-bold"
            style={{ color: dark ? "#f4f4f5" : "#1e293b" }}
          >
            Pronto<span className="text-indigo-500">Currículo</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="rounded-xl px-3 py-2 text-sm font-medium transition"
            style={{
              background: dark ? "#27272a" : "#f1f5f9",
              color: dark ? "#a1a1aa" : "#64748b",
            }}
          >
            {dark ? "☀️ Claro" : "🌙 Escuro"}
          </button>
          <Link
            href="/criar"
            className="hidden sm:inline-flex whitespace-nowrap rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            Criar grátis →
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero({ dark }: { dark: boolean }) {
  return (
    <section
      className="py-16 md:py-24"
      style={{
        background: dark
          ? "linear-gradient(135deg, #09090b 0%, #18181b 50%, #09090b 100%)"
          : "linear-gradient(135deg, #eef2ff 0%, #fff 50%, #f0fdf4 100%)",
      }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Text */}
          <div>
            <span
              className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider"
              style={{
                background: dark ? "#312e81" : "#e0e7ff",
                color: dark ? "#a5b4fc" : "#4338ca",
              }}
            >
              100% online · Sem cadastro
            </span>
            <h1
              className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl"
              style={{ color: dark ? "#f4f4f5" : "#0f172a" }}
            >
              Crie um currículo{" "}
              <span className="text-indigo-500">profissional</span>{" "}
              em minutos
            </h1>
            <p
              className="mt-5 text-lg leading-relaxed"
              style={{ color: dark ? "#a1a1aa" : "#475569" }}
            >
              Preencha um formulário simples, veja o resultado em tempo real e
              baixe seu PDF sem marca d&apos;água — por apenas{" "}
              <strong style={{ color: dark ? "#f4f4f5" : "#0f172a" }}>R$ 9,90</strong>.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/criar"
                className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-700 active:scale-95"
              >
                ✏️ Criar meu currículo agora
              </Link>
              <span
                className="flex items-center justify-center text-sm"
                style={{ color: dark ? "#71717a" : "#94a3b8" }}
              >
                Criar é grátis · PDF por R$ 9,90
              </span>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
              {[
                { icon: "🔒", text: "Pagamento seguro" },
                { icon: "⚡", text: "Download imediato" },
                { icon: "📄", text: "PDF A4 profissional" },
                { icon: "🎨", text: "5 templates inclusos" },
              ].map((b) => (
                <span
                  key={b.text}
                  className="flex items-center gap-1.5 text-xs font-medium"
                  style={{ color: dark ? "#71717a" : "#64748b" }}
                >
                  <span>{b.icon}</span> {b.text}
                </span>
              ))}
            </div>
          </div>

          {/* App mockup */}
          <div className="hidden md:block">
            <AppMockup dark={dark} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats({ dark }: { dark: boolean }) {
  const items = [
    { value: "5 min", label: "para completar o formulário" },
    { value: "5", label: "templates profissionais" },
    { value: "R$9,90", label: "pagamento único, sem mensalidade" },
    { value: "100%", label: "responsivo — funciona no celular" },
  ];

  return (
    <section
      className="border-y py-12"
      style={{
        borderColor: dark ? "#27272a" : "#e2e8f0",
        background: dark ? "#18181b" : "#f8fafc",
      }}
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {items.map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-2xl font-extrabold text-indigo-500">{item.value}</div>
              <div
                className="mt-1 text-xs"
                style={{ color: dark ? "#71717a" : "#64748b" }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks({ dark }: { dark: boolean }) {
  const steps = [
    {
      icon: "✏️",
      title: "Preencha os dados",
      desc: "5 etapas simples: dados pessoais, resumo, experiências, educação e habilidades. Sugestões inteligentes em cada campo.",
      color: "#6366f1",
      bg: dark ? "#1e1b4b" : "#eef2ff",
    },
    {
      icon: "👁️",
      title: "Veja em tempo real",
      desc: "O currículo aparece ao vivo enquanto você digita. Troque templates, fontes e cores de acento na hora.",
      color: "#0891b2",
      bg: dark ? "#164e63" : "#ecfeff",
    },
    {
      icon: "📥",
      title: "Baixe em PDF",
      desc: "Pague R$ 9,90 via PIX ou cartão (até 12x). O PDF sem marca d'água é liberado imediatamente.",
      color: "#059669",
      bg: dark ? "#064e3b" : "#ecfdf5",
    },
  ];

  return (
    <section
      className="py-20"
      style={{ background: dark ? "#09090b" : "#ffffff" }}
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14 text-center">
          <h2
            className="text-3xl font-bold"
            style={{ color: dark ? "#f4f4f5" : "#0f172a" }}
          >
            Como funciona
          </h2>
          <p className="mt-3" style={{ color: dark ? "#71717a" : "#64748b" }}>
            Simples, rápido e sem burocracia.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="relative rounded-2xl p-6"
              style={{
                background: dark ? "#18181b" : "#f8fafc",
                border: `1px solid ${dark ? "#27272a" : "#e2e8f0"}`,
              }}
            >
              <div
                className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
                style={{ background: s.bg }}
              >
                {s.icon}
              </div>
              <div
                className="absolute right-5 top-5 text-4xl font-black opacity-10"
                style={{ color: s.color }}
              >
                {i + 1}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider" style={{ color: s.color }}>
                Passo {i + 1}
              </div>
              <h3
                className="mt-1 text-lg font-bold"
                style={{ color: dark ? "#f4f4f5" : "#0f172a" }}
              >
                {s.title}
              </h3>
              <p
                className="mt-2 text-sm leading-relaxed"
                style={{ color: dark ? "#71717a" : "#64748b" }}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Templates({ dark }: { dark: boolean }) {
  const templates = [
    {
      name: "Clássico",
      color: "#4338ca",
      tag: "🏆 Mais aprovado",
      tagBg: dark ? "#1c1917" : "#fef3c7",
      tagColor: dark ? "#fbbf24" : "#92400e",
      desc: "Formato Harvard. Aprovado por 94% dos recrutadores e 100% dos sistemas ATS.",
      card: <CardClassic color="#4338ca" />,
    },
    {
      name: "Moderno",
      color: "#4f46e5",
      tag: "✨ Visual marcante",
      tagBg: dark ? "#1e1b4b" : "#e0e7ff",
      tagColor: dark ? "#a5b4fc" : "#4338ca",
      desc: "Barra de cor sutil no topo. Hierarquia clara para TI, negócios e marketing.",
      card: <CardModern color="#4f46e5" />,
    },
    {
      name: "Minimalista",
      color: "#0891b2",
      tag: "🤖 Favorito das IAs",
      tagBg: dark ? "#0c4a6e" : "#e0f2fe",
      tagColor: dark ? "#38bdf8" : "#0369a1",
      desc: "Zero ornamentos. Máxima leitura por robôs ATS e headhunters exigentes.",
      card: <CardMinimal color="#0891b2" />,
    },
    {
      name: "Executivo",
      color: "#7c3aed",
      tag: "👔 C-Level & Gestão",
      tagBg: dark ? "#2e1065" : "#f3e8ff",
      tagColor: dark ? "#c4b5fd" : "#6d28d9",
      desc: "Tom refinado e espaçamento generoso. Transmite autoridade e liderança.",
      card: <CardExecutive color="#7c3aed" />,
    },
    {
      name: "Criativo",
      color: "#e11d48",
      tag: "🎨 Startups & Design",
      tagBg: dark ? "#4c0519" : "#ffe4e6",
      tagColor: dark ? "#fda4af" : "#9f1239",
      desc: "Destaque sutil na inicial do nome. Diferenciado e 100% ATS-safe.",
      card: <CardCreative color="#e11d48" />,
    },
  ];

  return (
    <section
      className="py-20"
      style={{ background: dark ? "#18181b" : "#f8fafc" }}
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14 text-center">
          <h2
            className="text-3xl font-bold"
            style={{ color: dark ? "#f4f4f5" : "#0f172a" }}
          >
            5 templates aprovados por RH
          </h2>
          <p className="mt-3 max-w-xl mx-auto" style={{ color: dark ? "#71717a" : "#64748b" }}>
            Todos projetados para passar em sistemas ATS e agradar recrutadores humanos.
            Troque na hora, sem perder nenhum dado preenchido.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-5">
          {templates.map((t) => (
            <div key={t.name} className="flex flex-col gap-2.5">
              {t.card}
              <div>
                <span
                  className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold mb-1"
                  style={{ background: t.tagBg, color: t.tagColor }}
                >
                  {t.tag}
                </span>
                <div
                  className="text-sm font-bold"
                  style={{ color: dark ? "#f4f4f5" : "#0f172a" }}
                >
                  {t.name}
                </div>
                <div
                  className="text-xs leading-snug mt-0.5"
                  style={{ color: dark ? "#71717a" : "#64748b" }}
                >
                  {t.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/criar"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Experimentar todos os templates →
          </Link>
        </div>
      </div>
    </section>
  );
}

function Pricing({ dark }: { dark: boolean }) {
  return (
    <section
      className="py-20"
      style={{ background: dark ? "#09090b" : "#ffffff" }}
    >
      <div className="mx-auto max-w-lg px-6 text-center">
        <h2
          className="text-3xl font-bold"
          style={{ color: dark ? "#f4f4f5" : "#0f172a" }}
        >
          Preço simples e justo
        </h2>
        <p className="mt-3" style={{ color: dark ? "#71717a" : "#64748b" }}>
          Sem assinatura. Pague uma vez, o arquivo é seu.
        </p>

        <div
          className="mt-10 overflow-hidden rounded-3xl shadow-2xl"
          style={{
            border: `2px solid ${dark ? "#4338ca" : "#c7d2fe"}`,
            boxShadow: "0 25px 60px rgba(99,102,241,0.2)",
          }}
        >
          {/* Price header */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 px-8 py-8 text-white">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-200">
              Pagamento único
            </p>
            <div className="mt-2 flex items-end justify-center gap-1">
              <span className="text-xl font-bold">R$</span>
              <span className="text-7xl font-black leading-none">9</span>
              <span className="text-4xl font-bold">,90</span>
            </div>
            <p className="mt-1 text-sm text-indigo-200">por currículo · para sempre</p>
          </div>

          {/* Features */}
          <div
            className="px-8 py-6"
            style={{ background: dark ? "#18181b" : "#ffffff" }}
          >
            <ul className="space-y-3 text-left text-sm">
              {[
                "✅ PDF A4 de alta resolução",
                "✅ Sem marca d'água",
                "✅ Download imediato após pagamento",
                "✅ PIX (instantâneo) ou Cartão até 12x",
                "✅ 5 templates profissionais inclusos",
                "✅ Criar e visualizar é 100% grátis",
              ].map((item) => (
                <li key={item} style={{ color: dark ? "#d4d4d8" : "#374151" }}>
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="/criar"
              className="mt-8 flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 text-base font-bold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-700 active:scale-95"
            >
              Começar agora — é grátis
            </Link>

            <p
              className="mt-3 text-center text-xs"
              style={{ color: dark ? "#52525b" : "#94a3b8" }}
            >
              Paga só na hora do download
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ({ dark }: { dark: boolean }) {
  const items = [
    {
      q: "Preciso criar uma conta?",
      a: "Não. Você preenche o formulário, visualiza o currículo e, se quiser baixar, faz o pagamento. Nenhum cadastro necessário.",
    },
    {
      q: "Posso editar depois de pagar?",
      a: "Sim! O formulário fica disponível na sessão. Edite, visualize e refaça o download quantas vezes precisar enquanto a aba estiver aberta.",
    },
    {
      q: "O pagamento é seguro?",
      a: "Sim. Todo o processo é feito via Mercado Pago, a maior plataforma de pagamentos da América Latina. Seus dados financeiros nunca passam pelo nosso servidor.",
    },
    {
      q: "Funciona no celular?",
      a: "Sim! O site é totalmente responsivo. No celular você alterna entre formulário e prévia pelas abas no rodapé da tela.",
    },
    {
      q: "O PDF abre em qualquer leitor?",
      a: "Sim. O arquivo gerado é um PDF padrão A4 que abre normalmente no Adobe Reader, navegadores, Google Drive e qualquer outro visualizador.",
    },
  ];

  return (
    <section
      className="py-20"
      style={{ background: dark ? "#18181b" : "#f8fafc" }}
    >
      <div className="mx-auto max-w-2xl px-6">
        <h2
          className="mb-10 text-center text-3xl font-bold"
          style={{ color: dark ? "#f4f4f5" : "#0f172a" }}
        >
          Perguntas frequentes
        </h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.q}
              className="rounded-2xl p-6"
              style={{
                background: dark ? "#27272a" : "#ffffff",
                border: `1px solid ${dark ? "#3f3f46" : "#e2e8f0"}`,
              }}
            >
              <p className="font-semibold" style={{ color: dark ? "#f4f4f5" : "#0f172a" }}>
                {item.q}
              </p>
              <p
                className="mt-2 text-sm leading-relaxed"
                style={{ color: dark ? "#a1a1aa" : "#475569" }}
              >
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA({ dark }: { dark: boolean }) {
  return (
    <section className="relative overflow-hidden py-24 text-center">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700" />
      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative mx-auto max-w-2xl px-6">
        <div className="mb-4 text-5xl">🚀</div>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Pronto para se destacar?
        </h2>
        <p className="mt-4 text-lg text-indigo-200">
          Crie seu currículo profissional agora — leva menos de 10 minutos.
        </p>
        <Link
          href="/criar"
          className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-indigo-700 shadow-xl transition hover:bg-indigo-50 active:scale-95"
        >
          ✏️ Criar currículo grátis
        </Link>
        <p className="mt-4 text-sm text-indigo-300">
          Sem cadastro · Sem mensalidade · PDF por R$ 9,90
        </p>
      </div>
    </section>
  );
}

function Footer({ dark }: { dark: boolean }) {
  return (
    <footer
      className="py-10"
      style={{
        borderTop: `1px solid ${dark ? "#27272a" : "#e2e8f0"}`,
        background: dark ? "#09090b" : "#ffffff",
      }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📄</span>
            <span
              className="font-bold"
              style={{ color: dark ? "#f4f4f5" : "#1e293b" }}
            >
              Pronto<span className="text-indigo-500">Currículo</span>
            </span>
          </div>
          <p
            className="text-xs text-center"
            style={{ color: dark ? "#52525b" : "#94a3b8" }}
          >
            © {new Date().getFullYear()} ProntoCurrículo · Todos os direitos reservados · Pagamento seguro via Mercado Pago
          </p>
          <Link
            href="/criar"
            className="text-xs font-semibold text-indigo-500 hover:text-indigo-400 transition"
          >
            Criar currículo →
          </Link>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ─── */
export default function LandingPage() {
  const { dark, toggle } = useTheme();

  return (
    <div style={{ minHeight: "100vh", background: dark ? "#09090b" : "#ffffff" }}>
      <Nav dark={dark} toggle={toggle} />
      <Hero dark={dark} />
      <Stats dark={dark} />
      <HowItWorks dark={dark} />
      <Templates dark={dark} />
      <Pricing dark={dark} />
      <FAQ dark={dark} />
      <CTA dark={dark} />
      <Footer dark={dark} />
    </div>
  );
}

"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/resumeStore";
import { Experience } from "@/types/resume";

const inputClass =
  "w-full rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900";

// ── Suggestion phrases grouped by theme ──────────────────────────────────────
const PHRASE_GROUPS: { label: string; emoji: string; phrases: string[] }[] = [
  {
    label: "Gestão & Liderança",
    emoji: "🏆",
    phrases: [
      "Liderei equipe de X pessoas para atingir metas mensais",
      "Gerenciei projetos do planejamento à entrega, garantindo prazos e qualidade",
      "Implantei processos que aumentaram a produtividade em X%",
      "Coordenei reuniões de alinhamento semanais com stakeholders",
      "Treinei e desenvolvi novos colaboradores da equipe",
      "Elaborei relatórios gerenciais e apresentações para a diretoria",
      "Acompanhei indicadores de desempenho (KPIs) e propus melhorias contínuas",
    ],
  },
  {
    label: "Vendas & Atendimento",
    emoji: "🤝",
    phrases: [
      "Prospectei e conquistei X novos clientes por mês",
      "Atingi X% da meta de vendas mensalmente",
      "Realizei atendimento consultivo e pós-venda para carteira de X clientes",
      "Negociei contratos e propostas comerciais com tomadores de decisão",
      "Reduzi o churn de clientes em X% com ações de retenção",
      "Apresentei demonstrações de produto e conduzi reuniões de vendas",
      "Mantive taxa de satisfação do cliente (NPS/CSAT) acima de X",
    ],
  },
  {
    label: "Análise & Dados",
    emoji: "📊",
    phrases: [
      "Analisei dados e elaborei relatórios para suporte à tomada de decisão",
      "Criei dashboards e painéis de BI para acompanhamento de resultados",
      "Realizei mapeamento e otimização de processos internos",
      "Desenvolvi planilhas e automações que reduziram tempo operacional em X%",
      "Conduzi pesquisas de mercado e análise da concorrência",
      "Identifiquei oportunidades de melhoria com base em dados históricos",
    ],
  },
  {
    label: "Operações & Projetos",
    emoji: "⚙️",
    phrases: [
      "Controlei estoque e garantia de abastecimento com índice de ruptura < X%",
      "Executei processos de compras, cotações e negociação com fornecedores",
      "Monitorei indicadores de qualidade e propus ações corretivas",
      "Apoiei na implementação de sistema ERP/CRM, treinando usuários",
      "Redigi procedimentos operacionais padrão (POPs) e manuais de processo",
      "Participei de projetos de melhoria contínua (Lean, Kaizen, 5S)",
    ],
  },
  {
    label: "Comunicação & Marketing",
    emoji: "📣",
    phrases: [
      "Criei e gerenciei conteúdo para redes sociais, aumentando engajamento em X%",
      "Planejei e executei campanhas de marketing digital (Google Ads, Meta Ads)",
      "Produzi materiais de comunicação interna e externa",
      "Gerenciei o relacionamento com imprensa e parceiros estratégicos",
      "Monitorei métricas de marketing (alcance, conversão, ROI) e otimizei campanhas",
    ],
  },
  {
    label: "TI & Desenvolvimento",
    emoji: "💻",
    phrases: [
      "Desenvolvi funcionalidades e correções utilizando [tecnologia]",
      "Participei de ciclos ágeis (Scrum/Kanban) com entregas semanais",
      "Realizei revisões de código e contribuí para boas práticas de desenvolvimento",
      "Integrei APIs REST/GraphQL e serviços de terceiros",
      "Implementei melhorias de performance que reduziram o tempo de resposta em X%",
      "Prestei suporte técnico N1/N2/N3 e reduzi tempo médio de resolução",
    ],
  },
  {
    label: "Resultados & Conquistas",
    emoji: "🎯",
    phrases: [
      "Recebi reconhecimento interno pelo desempenho acima da meta",
      "Fui promovido(a) após X meses pela entrega de resultados consistentes",
      "Reduzi custos operacionais em X% com iniciativas de otimização",
      "Aumentei a receita do setor em X% no período de gestão",
      "Implementei projeto que gerou economia de R$ X para a empresa",
      "Conquistei o prêmio de melhor [área] do trimestre/ano",
    ],
  },
];

function newExp(): Experience {
  return {
    id: crypto.randomUUID(),
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  };
}

function PhraseChips({
  description,
  onAdd,
}: {
  description: string;
  onAdd: (phrase: string) => void;
}) {
  const [activeGroup, setActiveGroup] = useState<number | null>(null);

  const append = (phrase: string) => {
    const current = description.trim();
    const next = current ? `${current}\n• ${phrase}` : `• ${phrase}`;
    onAdd(next);
  };

  return (
    <div className="mt-1">
      <p className="mb-1.5 text-xs font-medium text-slate-500 dark:text-zinc-400">Sugestões de atividades:</p>
      {/* Group tabs */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {PHRASE_GROUPS.map((g, i) => (
          <button
            key={g.label}
            type="button"
            onClick={() => setActiveGroup(activeGroup === i ? null : i)}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition ${
              activeGroup === i
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700"
            }`}
          >
            <span>{g.emoji}</span>
            <span className="hidden sm:inline">{g.label}</span>
          </button>
        ))}
      </div>
      {/* Phrases of selected group */}
      {activeGroup !== null && (
        <div className="flex flex-col gap-1.5 rounded-lg border border-slate-100 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/50 p-2">
          {PHRASE_GROUPS[activeGroup].phrases.map((phrase) => (
            <button
              key={phrase}
              type="button"
              onClick={() => append(phrase)}
              className="flex items-start gap-2 rounded-md px-2 py-1.5 text-left text-xs text-slate-600 dark:text-zinc-300 transition hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-700 dark:hover:text-indigo-400"
            >
              <span className="mt-0.5 shrink-0 text-indigo-400">+</span>
              <span>{phrase}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ExperienceCard({
  exp,
  onUpdate,
  onRemove,
  onMove,
  isFirst,
  isLast,
}: {
  exp: Experience;
  onUpdate: (id: string, data: Partial<Experience>) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, dir: "up" | "down") => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [open, setOpen] = useState(true);

  const field = (key: keyof Experience) => ({
    value: exp[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onUpdate(exp.id, { [key]: e.target.value }),
  });

  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/40">
      {/* Card header — div instead of button to avoid nested <button> invalid HTML */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => e.key === "Enter" && setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-800 dark:text-zinc-100">{exp.role || "Novo cargo"}</p>
          <p className="text-xs text-slate-500 dark:text-zinc-400">{exp.company || "Empresa"}</p>
        </div>
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button type="button" disabled={isFirst} onClick={() => onMove(exp.id, "up")} className="rounded p-0.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-700 hover:text-slate-700 dark:hover:text-zinc-200 disabled:opacity-20">▲</button>
          <button type="button" disabled={isLast} onClick={() => onMove(exp.id, "down")} className="rounded p-0.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-700 hover:text-slate-700 dark:hover:text-zinc-200 disabled:opacity-20">▼</button>
          <span className="ml-1 text-slate-300 dark:text-zinc-600">{open ? "▲" : "▼"}</span>
        </div>
      </div>

      {open && (
        <div className="grid grid-cols-1 gap-3 border-t border-slate-200 dark:border-zinc-700 px-4 pb-4 pt-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600 dark:text-zinc-400">Cargo *</label>
            <input placeholder="Ex: Analista de Marketing" className={inputClass} {...field("role")} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600 dark:text-zinc-400">Empresa *</label>
            <input placeholder="Ex: Empresa LTDA" className={inputClass} {...field("company")} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600 dark:text-zinc-400">Início</label>
            <input type="month" className={inputClass} {...field("startDate")} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600 dark:text-zinc-400">Fim</label>
            <input
              type="month"
              className={inputClass}
              disabled={exp.current}
              value={exp.current ? "" : exp.endDate}
              onChange={(e) => onUpdate(exp.id, { endDate: e.target.value })}
            />
            <label className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 cursor-pointer">
              <input
                type="checkbox"
                checked={exp.current}
                onChange={(e) => onUpdate(exp.id, { current: e.target.checked })}
                className="rounded"
              />
              Emprego atual
            </label>
          </div>
          <div className="col-span-full flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600 dark:text-zinc-400">
              Descrição das atividades
            </label>
            <textarea
              rows={4}
              placeholder="Descreva suas principais responsabilidades e conquistas..."
              className={`${inputClass} resize-none`}
              value={exp.description}
              onChange={(e) => onUpdate(exp.id, { description: e.target.value })}
            />
            <PhraseChips
              description={exp.description}
              onAdd={(text) => onUpdate(exp.id, { description: text })}
            />
          </div>
          <div className="col-span-full flex justify-end">
            <button
              type="button"
              onClick={() => onRemove(exp.id)}
              className="text-xs font-medium text-red-500 hover:text-red-700 transition"
            >
              🗑 Remover experiência
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StepExperience() {
  const { data, addExperience, updateExperience, removeExperience, moveExperience } = useResumeStore();

  return (
    <div className="flex flex-col gap-3">
      {data.experiences.length === 0 && (
        <p className="text-sm text-slate-400 dark:text-zinc-600 text-center py-6">Nenhuma experiência adicionada ainda.</p>
      )}

      {data.experiences.map((exp, i) => (
        <ExperienceCard
          key={exp.id}
          exp={exp}
          onUpdate={updateExperience}
          onRemove={removeExperience}
          onMove={moveExperience}
          isFirst={i === 0}
          isLast={i === data.experiences.length - 1}
        />
      ))}

      <button
        type="button"
        onClick={() => addExperience(newExp())}
        className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-300 py-3 text-sm font-medium text-indigo-600 transition hover:border-indigo-500 hover:bg-indigo-50"
      >
        + Adicionar experiência
      </button>
    </div>
  );
}

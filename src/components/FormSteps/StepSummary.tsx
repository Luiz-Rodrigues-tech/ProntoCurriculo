"use client";

import { useResumeStore } from "@/store/resumeStore";

export default function StepSummary() {
  const { data, updateSummary } = useResumeStore();

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-slate-500 dark:text-zinc-400">
        Escreva 2–3 frases destacando seu perfil profissional. Este é o primeiro
        texto que o recrutador lê.
      </p>
      <textarea
        value={data.summary}
        onChange={(e) => updateSummary(e.target.value)}
        rows={6}
        placeholder="Ex: Profissional com 5 anos de experiência em marketing digital, especializado em campanhas de performance e análise de dados. Busco contribuir com equipes inovadoras..."
        className="resize-none rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900"
      />
      <span className="text-right text-xs text-slate-400 dark:text-zinc-500">
        {data.summary.length}/600 caracteres
      </span>
    </div>
  );
}

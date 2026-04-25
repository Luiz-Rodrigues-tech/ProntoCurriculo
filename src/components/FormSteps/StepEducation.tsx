"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/resumeStore";
import { Education } from "@/types/resume";

const inputClass =
  "w-full rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900";

function newEdu(): Education {
  return {
    id: crypto.randomUUID(),
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
  };
}

function EducationCard({
  edu,
  onUpdate,
  onRemove,
  onMove,
  isFirst,
  isLast,
}: {
  edu: Education;
  onUpdate: (id: string, data: Partial<Education>) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, dir: "up" | "down") => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [open, setOpen] = useState(true);

  const field = (key: keyof Education) => ({
    value: edu[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      onUpdate(edu.id, { [key]: e.target.value }),
  });

  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/40">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => e.key === "Enter" && setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-800 dark:text-zinc-100">{edu.degree || "Nova formação"}</p>
          <p className="text-xs text-slate-500 dark:text-zinc-400">{edu.institution || "Instituição"}</p>
        </div>
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button type="button" disabled={isFirst} onClick={() => onMove(edu.id, "up")} className="rounded p-0.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-700 hover:text-slate-700 dark:hover:text-zinc-200 disabled:opacity-20">▲</button>
          <button type="button" disabled={isLast} onClick={() => onMove(edu.id, "down")} className="rounded p-0.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-700 hover:text-slate-700 dark:hover:text-zinc-200 disabled:opacity-20">▼</button>
          <span className="ml-1 text-slate-300 dark:text-zinc-600">{open ? "▲" : "▼"}</span>
        </div>
      </div>

      {open && (
        <div className="grid grid-cols-1 gap-3 border-t border-slate-200 dark:border-zinc-700 px-4 pb-4 pt-3 sm:grid-cols-2">
          <div className="col-span-full flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600 dark:text-zinc-400">Instituição *</label>
            <input
              placeholder="Ex: Universidade de São Paulo"
              className={inputClass}
              {...field("institution")}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600 dark:text-zinc-400">Grau</label>
            <select className={inputClass} {...field("degree")}>
              <option value="">Selecione</option>
              <option>Ensino Médio</option>
              <option>Técnico</option>
              <option>Tecnólogo</option>
              <option>Graduação</option>
              <option>Pós-graduação</option>
              <option>MBA</option>
              <option>Mestrado</option>
              <option>Doutorado</option>
              <option>Curso Livre</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600 dark:text-zinc-400">Área / Curso</label>
            <input
              placeholder="Ex: Administração de Empresas"
              className={inputClass}
              {...field("field")}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600 dark:text-zinc-400">Início</label>
            <input type="month" className={inputClass} {...field("startDate")} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600 dark:text-zinc-400">Conclusão</label>
            <input type="month" className={inputClass} {...field("endDate")} />
          </div>
          <div className="col-span-full flex justify-end">
            <button
              type="button"
              onClick={() => onRemove(edu.id)}
              className="text-xs font-medium text-red-500 hover:text-red-700 transition"
            >
              🗑 Remover formação
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StepEducation() {
  const { data, addEducation, updateEducation, removeEducation, moveEducation } = useResumeStore();

  return (
    <div className="flex flex-col gap-3">
      {data.education.length === 0 && (
        <p className="text-sm text-slate-400 dark:text-zinc-600 text-center py-6">Nenhuma formação adicionada ainda.</p>
      )}

      {data.education.map((edu, i) => (
        <EducationCard
          key={edu.id}
          edu={edu}
          onUpdate={updateEducation}
          onRemove={removeEducation}
          onMove={moveEducation}
          isFirst={i === 0}
          isLast={i === data.education.length - 1}
        />
      ))}

      <button
        type="button"
        onClick={() => addEducation(newEdu())}
        className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-300 py-3 text-sm font-medium text-indigo-600 transition hover:border-indigo-500 hover:bg-indigo-50"
      >
        + Adicionar formação
      </button>
    </div>
  );
}

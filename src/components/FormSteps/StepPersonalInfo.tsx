"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useResumeStore } from "@/store/resumeStore";

const schema = z.object({
  name:     z.string().min(2, "Nome muito curto"),
  jobTitle: z.string().optional(),
  email:    z.string().email("E-mail inválido"),
  phone:    z.string().min(14, "Telefone inválido"),
  location: z.string().min(2, "Informe sua cidade"),
  linkedin: z.string().optional(),
  website:  z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const inputClass =
  "rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900";

const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-slate-700 dark:text-zinc-300">{label}</label>
    {children}
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);

/** Templates that display a photo in the resume — all 5 support it */
const PHOTO_TEMPLATES = new Set(["classic", "modern", "minimal", "executive", "creative"]);

export default function StepPersonalInfo() {
  const { data, updatePersonalInfo } = useResumeStore();
  const photoRef = useRef<HTMLInputElement>(null);
  const showPhoto = PHOTO_TEMPLATES.has(data.template);

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:     data.personalInfo.name,
      jobTitle: data.personalInfo.jobTitle,
      email:    data.personalInfo.email,
      phone:    data.personalInfo.phone,
      location: data.personalInfo.location,
      linkedin: data.personalInfo.linkedin,
      website:  data.personalInfo.website,
    },
    mode: "onChange",
  });

  // Subscribe to form changes and sync to store
  useEffect(() => {
    const sub = watch((values) => {
      updatePersonalInfo({
        name:     values.name     ?? "",
        jobTitle: values.jobTitle ?? "",
        email:    values.email    ?? "",
        phone:    values.phone    ?? "",
        location: values.location ?? "",
        linkedin: values.linkedin ?? "",
        website:  values.website  ?? "",
      });
    });
    return () => sub.unsubscribe();
  }, [watch, updatePersonalInfo]);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Validate: max 2 MB
    if (file.size > 2 * 1024 * 1024) {
      alert("A foto deve ter no máximo 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      updatePersonalInfo({ photo: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

      {/* Photo upload — always visible */}
      <div className="col-span-full flex items-center gap-4 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 p-4">
        {data.personalInfo.photo ? (
          <img
            src={data.personalInfo.photo}
            alt="Foto"
            className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-indigo-200"
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-zinc-700 text-3xl text-slate-400">
            👤
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium text-slate-700 dark:text-zinc-300">
            Foto de perfil{" "}
            <span className="font-normal text-slate-400 dark:text-zinc-500">(opcional)</span>
          </p>
          <p className="text-xs text-slate-500 dark:text-zinc-400">JPG ou PNG · máx. 2 MB</p>
          {!showPhoto && (
            <p className="text-[11px] text-amber-500 dark:text-amber-400">
              📌 A foto aparece nos templates: Moderno, Minimalista, Executivo e Criativo
            </p>
          )}
          <div className="flex gap-2">
            <input ref={photoRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            <button
              type="button"
              onClick={() => photoRef.current?.click()}
              className="rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-zinc-200 transition hover:bg-slate-100 dark:hover:bg-zinc-600"
            >
              {data.personalInfo.photo ? "Trocar foto" : "Adicionar foto"}
            </button>
            {data.personalInfo.photo && (
              <button
                type="button"
                onClick={() => updatePersonalInfo({ photo: "" })}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50"
              >
                Remover
              </button>
            )}
          </div>
        </div>
      </div>

      <Field label="Nome completo *" error={errors.name?.message}>
        <input {...register("name")} placeholder="Ex: Maria Silva" className={inputClass} />
      </Field>

      <Field label="Cargo / Título profissional" error={errors.jobTitle?.message}>
        <input {...register("jobTitle")} placeholder="Ex: Gerente de Marketing" className={inputClass} />
      </Field>

      <Field label="E-mail *" error={errors.email?.message}>
        <input {...register("email")} type="email" placeholder="seu@email.com" className={inputClass} />
      </Field>

      <Field label="Telefone *" error={errors.phone?.message}>
        <input
          {...register("phone")}
          placeholder="(11) 99999-9999"
          className={inputClass}
          inputMode="numeric"
          maxLength={15}
          onChange={(e) => {
            // Remove tudo que não é dígito
            const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
            // Aplica máscara: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
            let masked = digits;
            if (digits.length > 10) {
              // Celular: (XX) XXXXX-XXXX
              masked = digits.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
            } else if (digits.length > 6) {
              // Fixo em progresso: (XX) XXXX-XXXX
              masked = digits.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
            } else if (digits.length > 2) {
              masked = digits.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
            } else if (digits.length > 0) {
              masked = digits.replace(/^(\d{0,2})/, "($1");
            }
            e.target.value = masked;
            register("phone").onChange(e);
          }}
        />
      </Field>

      <Field label="Cidade / Estado *" error={errors.location?.message}>
        <input {...register("location")} placeholder="São Paulo, SP" className={inputClass} />
      </Field>

      <Field label="LinkedIn" error={errors.linkedin?.message}>
        <input {...register("linkedin")} placeholder="linkedin.com/in/seu-perfil" className={inputClass} />
      </Field>

      <Field label="Site / Portfólio" error={errors.website?.message}>
        <input {...register("website")} placeholder="www.seusite.com.br" className={inputClass} />
      </Field>
    </div>
  );
}

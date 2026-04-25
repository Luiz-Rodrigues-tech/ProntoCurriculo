"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ResumeForm from "@/components/ResumeForm";
import ResumePreview from "@/components/ResumePreview";
import CheckoutModal from "@/components/CheckoutModal";
import { useResumeStore } from "@/store/resumeStore";

const THEME_KEY = "pc-theme"; // shared key between landing and editor

export default function CriarPage() {
  const [activePanel, setActivePanel] = useState<"form" | "preview">("form");
  const [showCheckout, setShowCheckout] = useState(false);
  const { allStepsDone, theme, toggleTheme } = useResumeStore();

  // Sync theme from localStorage on first mount
  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY) as "dark" | "light" | null;
    if (stored && stored !== theme) toggleTheme();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist every theme change to localStorage
  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return (
    <div
      className={`flex flex-col overflow-hidden bg-slate-50 dark:bg-zinc-950 ${theme === "dark" ? "dark" : ""}`}
      style={{ height: "100dvh" }}
    >

      {/* ── Top bar ── */}
      <header className="flex shrink-0 items-center justify-between border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 shadow-sm md:px-6 md:py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">📄</span>
          <span className="text-lg font-bold text-slate-800 dark:text-zinc-100">
            Pronto<span className="text-indigo-600">Currículo</span>
          </span>
        </Link>

        {/* Desktop subtitle */}
        <p className="hidden text-xs text-slate-500 dark:text-zinc-400 sm:block">
          Crie gratuitamente · Baixe o PDF por R$&nbsp;9,90
        </p>

        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Modo claro" : "Modo escuro"}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-zinc-300 transition hover:bg-slate-100 dark:hover:bg-zinc-700"
          >
            {theme === "dark" ? "☀️ Claro" : "🌙 Escuro"}
          </button>

          {/* Mobile quick-download — only after all steps done */}
          {allStepsDone && (
            <button
              onClick={() => setShowCheckout(true)}
              className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition active:scale-95 md:hidden"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              R$&nbsp;9,90
            </button>
          )}
        </div>
      </header>

      {/* ── Split content ── */}
      <main className="flex flex-1 overflow-hidden">
        {/* Form panel */}
        <section
          className={`flex-col overflow-hidden border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 md:flex md:w-1/2 lg:w-2/5 ${
            activePanel === "form" ? "flex w-full" : "hidden"
          }`}
        >
          <ResumeForm />
        </section>

        {/* Preview panel */}
        <section
          className={`flex-col overflow-hidden md:flex md:w-1/2 lg:w-3/5 ${
            activePanel === "preview" ? "flex w-full" : "hidden"
          }`}
        >
          <ResumePreview onDownloadClick={() => setShowCheckout(true)} />
        </section>
      </main>

      {/* ── Mobile bottom nav ── */}
      <nav className="flex shrink-0 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 md:hidden">
        {/* Formulário tab */}
        <button
          onClick={() => setActivePanel("form")}
          className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition-colors ${
            activePanel === "form" ? "text-indigo-600" : "text-slate-400 dark:text-zinc-500"
          }`}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={activePanel === "form" ? 2.5 : 1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
          </svg>
          <span>Formulário</span>
          {activePanel === "form" && (
            <span className="absolute bottom-0 left-0 h-0.5 w-1/2 rounded-full bg-indigo-600" />
          )}
        </button>

        {/* Preview tab */}
        <button
          onClick={() => setActivePanel("preview")}
          className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition-colors ${
            activePanel === "preview" ? "text-indigo-600" : "text-slate-400 dark:text-zinc-500"
          }`}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={activePanel === "preview" ? 2.5 : 1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.641 0-8.58-3.007-9.964-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Preview</span>
          {activePanel === "preview" && (
            <span className="absolute bottom-0 right-0 h-0.5 w-1/2 rounded-full bg-indigo-600" />
          )}
        </button>
      </nav>

      {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} />}
    </div>
  );
}

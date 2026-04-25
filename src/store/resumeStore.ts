import { create } from "zustand";
import { ResumeData, EMPTY_RESUME, Experience, Education, FontId } from "@/types/resume";

const TOTAL_STEPS = 5;

interface ResumeStore {
  data: ResumeData;
  currentStep: number;
  maxStepReached: number;         // highest step index ever visited
  allStepsDone: boolean;          // true once user reaches the last step
  theme: "light" | "dark";
  toggleTheme: () => void;
  setCurrentStep: (step: number) => void;
  updatePersonalInfo: (info: Partial<ResumeData["personalInfo"]>) => void;
  updateSummary: (summary: string) => void;
  updateTemplate: (template: ResumeData["template"]) => void;
  updateAccentColor: (color: string) => void;
  updateFont: (fontId: FontId) => void;
  toggleExecutiveLine: () => void;
  // Experience
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  moveExperience: (id: string, direction: "up" | "down") => void;
  // Education
  addEducation: (edu: Education) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  moveEducation: (id: string, direction: "up" | "down") => void;
  // Skills
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  reset: () => void;
}

function moveItem<T extends { id: string }>(
  items: T[],
  id: string,
  direction: "up" | "down"
): T[] {
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return items;
  const target = direction === "up" ? idx - 1 : idx + 1;
  if (target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[idx], next[target]] = [next[target], next[idx]];
  return next;
}

export const useResumeStore = create<ResumeStore>((set) => ({
  data: EMPTY_RESUME,
  currentStep: 0,
  maxStepReached: 0,
  allStepsDone: false,
  theme: "light",
  toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),

  setCurrentStep: (step) =>
    set((s) => {
      const maxStepReached = Math.max(s.maxStepReached, step);
      return {
        currentStep: step,
        maxStepReached,
        allStepsDone: maxStepReached >= TOTAL_STEPS - 1,
      };
    }),

  updatePersonalInfo: (info) =>
    set((s) => ({ data: { ...s.data, personalInfo: { ...s.data.personalInfo, ...info } } })),

  updateSummary: (summary) => set((s) => ({ data: { ...s.data, summary } })),

  updateTemplate: (template) => set((s) => ({ data: { ...s.data, template } })),

  updateAccentColor: (accentColor) => set((s) => ({ data: { ...s.data, accentColor } })),

  updateFont: (fontId) => set((s) => ({ data: { ...s.data, fontId } })),

  toggleExecutiveLine: () =>
    set((s) => ({ data: { ...s.data, executiveLine: !s.data.executiveLine } })),

  addExperience: (exp) =>
    set((s) => ({ data: { ...s.data, experiences: [...s.data.experiences, exp] } })),

  updateExperience: (id, exp) =>
    set((s) => ({
      data: {
        ...s.data,
        experiences: s.data.experiences.map((e) => (e.id === id ? { ...e, ...exp } : e)),
      },
    })),

  removeExperience: (id) =>
    set((s) => ({ data: { ...s.data, experiences: s.data.experiences.filter((e) => e.id !== id) } })),

  moveExperience: (id, direction) =>
    set((s) => ({ data: { ...s.data, experiences: moveItem(s.data.experiences, id, direction) } })),

  addEducation: (edu) =>
    set((s) => ({ data: { ...s.data, education: [...s.data.education, edu] } })),

  updateEducation: (id, edu) =>
    set((s) => ({
      data: {
        ...s.data,
        education: s.data.education.map((e) => (e.id === id ? { ...e, ...edu } : e)),
      },
    })),

  removeEducation: (id) =>
    set((s) => ({ data: { ...s.data, education: s.data.education.filter((e) => e.id !== id) } })),

  moveEducation: (id, direction) =>
    set((s) => ({ data: { ...s.data, education: moveItem(s.data.education, id, direction) } })),

  addSkill: (skill) =>
    set((s) => ({ data: { ...s.data, skills: [...s.data.skills, skill] } })),

  removeSkill: (skill) =>
    set((s) => ({ data: { ...s.data, skills: s.data.skills.filter((sk) => sk !== skill) } })),

  reset: () => set((s) => ({ data: EMPTY_RESUME, currentStep: 0, maxStepReached: 0, allStepsDone: false, theme: s.theme })),
}));

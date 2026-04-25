export interface PersonalInfo {
  name: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  photo: string; // base64 dataURL
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

export type TemplateId = "classic" | "modern" | "minimal" | "executive" | "creative";

export type FontId = "inter" | "lora" | "poppins" | "mono";

export const FONT_OPTIONS: {
  id: FontId;
  label: string;
  css: string;
  pdfFont: string;
  pdfBoldFont: string;
}[] = [
  {
    id: "inter",
    label: "Inter",
    css: "var(--font-geist-sans), system-ui, sans-serif",
    pdfFont: "Helvetica",
    pdfBoldFont: "Helvetica-Bold",
  },
  {
    id: "lora",
    label: "Lora",
    css: "var(--font-lora), Georgia, serif",
    pdfFont: "Times-Roman",
    pdfBoldFont: "Times-Bold",
  },
  {
    id: "poppins",
    label: "Poppins",
    css: "var(--font-poppins), system-ui, sans-serif",
    pdfFont: "Helvetica",
    pdfBoldFont: "Helvetica-Bold",
  },
  {
    id: "mono",
    label: "Mono",
    css: "var(--font-space-mono), 'Courier New', monospace",
    pdfFont: "Courier",
    pdfBoldFont: "Courier-Bold",
  },
];

export const DEFAULT_FONT: FontId = "inter";

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: string[];
  template: TemplateId;
  accentColor: string;
  fontId: FontId;
  executiveLine: boolean; // show/hide vertical accent line in Executive template
}

export const ACCENT_COLORS = [
  { label: "Índigo",     value: "#4338ca" },
  { label: "Azul",      value: "#1d4ed8" },
  { label: "Ciano",     value: "#0891b2" },
  { label: "Teal",      value: "#0d9488" },
  { label: "Verde",     value: "#16a34a" },
  { label: "Esmeralda", value: "#059669" },
  { label: "Limão",     value: "#65a30d" },
  { label: "Âmbar",     value: "#d97706" },
  { label: "Laranja",   value: "#ea580c" },
  { label: "Vermelho",  value: "#dc2626" },
  { label: "Rosa",      value: "#db2777" },
  { label: "Violeta",   value: "#7c3aed" },
  { label: "Roxo",      value: "#9333ea" },
  { label: "Cinza",     value: "#334155" },
] as const;

export const DEFAULT_ACCENT = ACCENT_COLORS[0].value;

export const EMPTY_RESUME: ResumeData = {
  personalInfo: {
    name: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    photo: "",
  },
  summary: "",
  experiences: [],
  education: [],
  skills: [],
  template: "classic",
  accentColor: DEFAULT_ACCENT,
  fontId: DEFAULT_FONT,
  executiveLine: true,
};

"use client";

import { useState, useRef } from "react";
import { useResumeStore } from "@/store/resumeStore";

const SUGGESTIONS: { category: string; items: string[] }[] = [
  {
    category: "Comportamentais",
    items: [
      "Liderança", "Trabalho em equipe", "Comunicação", "Proatividade",
      "Organização", "Resolução de problemas", "Pensamento crítico",
      "Adaptabilidade", "Inteligência emocional", "Gestão do tempo",
      "Criatividade", "Atenção aos detalhes", "Tomada de decisão", "Flexibilidade",
      "Empatia", "Resiliência", "Foco em resultados", "Autogestão",
      "Colaboração", "Persuasão", "Negociação", "Escuta ativa",
      "Visão estratégica", "Orientação ao cliente", "Senso de urgência",
      "Comprometimento", "Ética profissional", "Pontualidade",
      "Capacidade analítica", "Curiosidade intelectual", "Aprendizado rápido",
    ],
  },
  {
    category: "Escritório & Gestão",
    items: [
      "Microsoft Excel", "Excel Avançado", "Excel Básico", "Microsoft Word",
      "PowerPoint", "Outlook", "Microsoft 365", "Google Workspace",
      "Google Sheets", "Google Docs", "Google Slides", "Google Drive",
      "Notion", "Slack", "Teams", "Zoom", "Trello", "Asana", "Monday.com",
      "ClickUp", "Jira", "Confluence",
      "Gestão de projetos", "Scrum", "Kanban", "Agile", "OKR", "PDCA",
      "Power BI", "Tableau", "Looker Studio", "Business Intelligence",
      "Análise de dados", "Relatórios gerenciais", "KPIs",
      "SAP", "Totvs", "CRM", "Salesforce", "HubSpot", "ERP", "Protheus",
      "Pacote Office", "BrOffice", "LibreOffice",
    ],
  },
  {
    category: "Vendas & Atendimento",
    items: [
      "Vendas", "Vendas B2B", "Vendas B2C", "Vendas consultivas",
      "Negociação", "Técnicas de vendas", "SPIN Selling", "Inside Sales",
      "Field Sales", "SDR", "BDR", "Account Executive",
      "Atendimento ao Cliente", "Customer Success", "Customer Experience",
      "Suporte ao Cliente", "Pós-venda", "Retenção de clientes",
      "Prospecção de clientes", "Cold Call", "Cold Email",
      "Gestão de contratos", "Funil de vendas", "CRM", "Pipeline",
      "Upsell", "Cross-sell", "NPS", "CSAT", "SLA",
      "Televendas", "E-commerce", "Marketplace",
    ],
  },
  {
    category: "Marketing & Comunicação",
    items: [
      "Marketing Digital", "Marketing de Conteúdo", "Inbound Marketing",
      "Outbound Marketing", "Growth Marketing", "Performance Marketing",
      "SEO", "SEM", "Link Building", "Google Ads", "Meta Ads",
      "LinkedIn Ads", "TikTok Ads", "YouTube Ads",
      "Copywriting", "Redação publicitária", "Storytelling",
      "Branding", "Identidade visual", "Gestão de marca",
      "Gestão de redes sociais", "Instagram", "LinkedIn", "TikTok",
      "Email marketing", "Automação de marketing", "RD Station", "Mailchimp",
      "Google Analytics", "Google Tag Manager", "Meta Pixel",
      "Edição de vídeo", "Produção de conteúdo", "Canva", "Adobe Premiere",
      "Assessoria de imprensa", "Relações públicas", "Comunicação corporativa",
      "Endomarketing", "Comunicação interna",
    ],
  },
  {
    category: "Tecnologia",
    items: [
      "Python", "JavaScript", "TypeScript", "Java", "C", "C++", "C#",
      "PHP", "Ruby", "Go", "Rust", "Kotlin", "Swift",
      "React", "Next.js", "Vue.js", "Angular", "Node.js", "Express",
      "Django", "FastAPI", "Flask", "Spring Boot", "Laravel",
      "React Native", "Flutter",
      "SQL", "PostgreSQL", "MySQL", "SQLite", "MongoDB", "Redis",
      "Firebase", "Supabase", "DynamoDB",
      "Docker", "Kubernetes", "CI/CD", "GitHub Actions", "Jenkins",
      "AWS", "Azure", "Google Cloud", "Vercel", "Heroku",
      "Git", "GitHub", "GitLab", "Bitbucket",
      "REST APIs", "GraphQL", "WebSockets", "Microsserviços",
      "Linux", "Shell Script", "Bash",
      "Machine Learning", "Inteligência Artificial", "LLMs", "ChatGPT API",
      "Data Science", "Pandas", "NumPy", "TensorFlow", "PyTorch",
      "VBA", "Power Automate", "Zapier", "n8n",
      "Suporte técnico", "Help Desk", "ITIL", "Redes e infraestrutura",
      "Segurança da informação", "Pentest", "DevOps", "DevSecOps",
    ],
  },
  {
    category: "Design",
    items: [
      "Figma", "Adobe XD", "Sketch",
      "Adobe Photoshop", "Adobe Illustrator", "Adobe InDesign",
      "Adobe After Effects", "Adobe Premiere", "DaVinci Resolve",
      "Canva", "CorelDRAW",
      "UI Design", "UX Design", "UI/UX Design", "Product Design",
      "Design Thinking", "Design de Serviço", "Research de UX",
      "Prototipação", "Wireframe", "Fluxo de usuário", "Mapa de jornada",
      "Tipografia", "Teoria das cores", "Grid e layout",
      "Motion Design", "Animação", "Edição de vídeo",
      "Design gráfico", "Criação de logotipo", "Identidade visual",
      "Design editorial", "Diagramação",
    ],
  },
  {
    category: "Finanças & Contabilidade",
    items: [
      "Contabilidade", "Contabilidade fiscal", "Contabilidade gerencial",
      "Fluxo de caixa", "Conciliação bancária", "Contas a pagar",
      "Contas a receber", "DRE", "Balanço patrimonial",
      "Imposto de Renda", "IRPJ", "IRPF", "Simples Nacional",
      "Lucro Presumido", "Lucro Real", "Obrigações acessórias",
      "SPED Fiscal", "SPED Contábil", "ECF", "ECD",
      "Planejamento financeiro", "Planejamento tributário",
      "Análise de investimentos", "Valuation", "Modelagem financeira",
      "FP&A", "Budget", "Forecast", "Controle de custos",
      "Auditoria", "Compliance fiscal", "LGPD financeira",
      "Excel Financeiro", "Power BI Financeiro",
      "SAP FI", "Totvs Financeiro", "Conta Azul", "QuickBooks",
      "Tesouraria", "Câmbio", "Mercado de capitais",
    ],
  },
  {
    category: "Logística & Operações",
    items: [
      "Logística", "Logística reversa", "Supply Chain", "SCM",
      "Gestão de estoque", "Inventário", "WMS", "TMS",
      "Compras", "Procurement", "Sourcing", "Gestão de fornecedores",
      "Importação", "Exportação", "Comércio exterior", "SISCOMEX",
      "Transporte rodoviário", "Transporte aéreo", "Multimodal",
      "Armazenagem", "Picking", "Packing", "Expedição",
      "Lean Manufacturing", "Six Sigma", "Kaizen", "5S", "PDCA",
      "ISO 9001", "ISO 14001", "ISO 45001", "OHSAS 18001",
      "Controle de qualidade", "Gestão da qualidade", "PPAP", "FMEA",
      "Manutenção preventiva", "Manutenção corretiva", "TPM",
      "PCP", "Planejamento da produção", "MRP", "ERP logístico",
    ],
  },
  {
    category: "Direito & RH",
    items: [
      "Legislação trabalhista", "CLT", "Direito do trabalho",
      "Direito civil", "Direito empresarial", "Direito tributário",
      "Contratos", "Elaboração de contratos", "Análise contratual",
      "LGPD", "Compliance", "Gestão de riscos", "Due diligence",
      "Recrutamento e seleção", "R&S", "Entrevistas por competências",
      "Onboarding", "Offboarding", "Treinamento e desenvolvimento",
      "T&D", "Educação corporativa", "LMS",
      "Folha de pagamento", "eSocial", "CAGED", "RAIS",
      "DHO", "Cultura organizacional", "Clima organizacional",
      "Gestão de pessoas", "Avaliação de desempenho",
      "Cargos e salários", "Plano de cargos", "Benefícios",
      "HRBP", "People Analytics", "Diversidade e Inclusão",
      "Medicina do trabalho", "CIPA", "SESMT", "SST",
    ],
  },
  {
    category: "Idiomas",
    items: [
      "Inglês fluente", "Inglês avançado", "Inglês intermediário",
      "Inglês básico", "Inglês técnico",
      "Espanhol fluente", "Espanhol avançado", "Espanhol intermediário",
      "Espanhol básico",
      "Francês fluente", "Francês avançado", "Francês intermediário",
      "Alemão fluente", "Alemão avançado", "Alemão intermediário",
      "Italiano", "Português (nativo)", "Português avançado",
      "Mandarim", "Japonês", "Russo", "Árabe",
    ],
  },
];

// Flat list for search
const ALL_SUGGESTIONS = SUGGESTIONS.flatMap((g) => g.items);

export default function StepSkills() {
  const { data, addSkill, removeSkill } = useResumeStore();
  const [input, setInput] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = (value = input) => {
    const trimmed = value.trim();
    if (trimmed && !data.skills.includes(trimmed)) {
      addSkill(trimmed);
    }
    setInput("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAdd();
    }
  };

  // When searching: flat filtered list. Otherwise: show active category or nothing.
  const searching = input.length > 0;
  const searchResults = searching
    ? ALL_SUGGESTIONS.filter(
        (s) => !data.skills.includes(s) && s.toLowerCase().includes(input.toLowerCase())
      ).slice(0, 12)
    : [];

  const categoryItems = !searching && activeCategory
    ? (SUGGESTIONS.find((g) => g.category === activeCategory)?.items ?? []).filter(
        (s) => !data.skills.includes(s)
      )
    : [];

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-500 dark:text-zinc-400">
        Adicione habilidades técnicas e comportamentais. Pressione{" "}
        <kbd className="rounded border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 text-xs dark:text-zinc-300">Enter</kbd>{" "}
        ou{" "}
        <kbd className="rounded border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 text-xs dark:text-zinc-300">,</kbd>{" "}
        para confirmar.
      </p>

      {/* Tag input */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => { setInput(e.target.value); setActiveCategory(null); }}
          onKeyDown={handleKeyDown}
          placeholder="Ex: Excel, Liderança, Python..."
          className="flex-1 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900"
        />
        <button
          type="button"
          onClick={() => handleAdd()}
          disabled={!input.trim()}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-30"
        >
          + Add
        </button>
      </div>

      {/* Added skills */}
      {data.skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill) => (
            <span
              key={skill}
              className="flex items-center gap-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950 px-3 py-1 text-sm font-medium text-indigo-700 dark:text-indigo-300"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="leading-none text-indigo-400 transition hover:text-indigo-700 dark:hover:text-indigo-200"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search results */}
      {searching && searchResults.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium text-slate-500 dark:text-zinc-400">Resultados:</p>
          <div className="flex flex-wrap gap-2">
            {searchResults.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleAdd(s)}
                className="rounded-full border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1 text-sm text-slate-600 dark:text-zinc-300 transition hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category browser */}
      {!searching && (
        <div>
          <p className="mb-2 text-xs font-medium text-slate-500 dark:text-zinc-400">Navegar por área:</p>
          {/* Category pills */}
          <div className="mb-3 flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((g) => (
              <button
                key={g.category}
                type="button"
                onClick={() => setActiveCategory(activeCategory === g.category ? null : g.category)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                  activeCategory === g.category
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700"
                }`}
              >
                {g.category}
              </button>
            ))}
          </div>
          {/* Items of selected category */}
          {categoryItems.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {categoryItems.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleAdd(s)}
                  className="rounded-full border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1 text-sm text-slate-600 dark:text-zinc-300 transition hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
                >
                  + {s}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

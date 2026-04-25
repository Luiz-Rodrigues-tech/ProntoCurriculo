import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import { ResumeData, Experience, Education, FONT_OPTIONS, FontId } from "@/types/resume";

/* ─── Font mapping ─── */
function getPdfFonts(fontId: FontId) {
  const opt = FONT_OPTIONS.find((f) => f.id === fontId) ?? FONT_OPTIONS[0];
  return { regular: opt.pdfFont, bold: opt.pdfBoldFont };
}

/* ─── Helpers ─── */
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

/* ─── Shared sub-components ─── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ExpBlock({ exp, styles, bold, accent }: { exp: Experience; styles: any; bold: string; accent?: string }) {
  const period = formatPeriod(exp.startDate, exp.endDate, exp.current);
  return (
    <View style={styles.expBlock}>
      <View style={styles.expRow}>
        <Text style={[styles.expRole, { fontFamily: bold }]}>{exp.role}</Text>
        {period ? <Text style={styles.expPeriod}>{period}</Text> : null}
      </View>
      <Text style={[styles.expCompany, accent ? { color: accent } : {}]}>{exp.company}</Text>
      {exp.description ? <Text style={styles.expDesc}>{exp.description}</Text> : null}
    </View>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function EduBlock({ edu, styles, bold }: { edu: Education; styles: any; bold: string }) {
  const label = [edu.degree, edu.field].filter(Boolean).join(" em ");
  const period = formatPeriod(edu.startDate, edu.endDate, false);
  return (
    <View style={styles.expBlock}>
      <View style={styles.expRow}>
        <Text style={[styles.expRole, { fontFamily: bold }]}>{label || "Graduação"}</Text>
        {period ? <Text style={styles.expPeriod}>{period}</Text> : null}
      </View>
      <Text style={styles.expCompany}>{edu.institution}</Text>
    </View>
  );
}

/* ═══════════════════════════════════════════════════════════
   1. CLÁSSICO — Harvard puro · coluna única
═══════════════════════════════════════════════════════════ */
const classic = StyleSheet.create({
  page:       { fontSize: 11, padding: "36 40", color: "#1e293b" },
  contacts:   { fontSize: 9, color: "#64748b", marginBottom: 12 },
  section:    { marginBottom: 14 },
  body:       { fontSize: 11, lineHeight: 1.5, color: "#334155" },
  expRole:    { fontSize: 11 },
  expCompany: { fontSize: 9.5, color: "#64748b", marginBottom: 2 },
  expPeriod:  { fontSize: 9, color: "#94a3b8" },
  expRow:     { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  expDesc:    { fontSize: 10, color: "#334155", marginTop: 2, lineHeight: 1.4 },
  expBlock:   { marginBottom: 8 },
});

function ClassicDocument({ data }: { data: ResumeData }) {
  const { personalInfo: p, summary, experiences, education, skills, accentColor, executiveLine } = data;
  const { regular, bold } = getPdfFonts(data.fontId);
  const contacts = [p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean);

  const secLabel = {
    fontSize: 8, fontFamily: bold, textTransform: "uppercase" as const,
    letterSpacing: 1.5, color: accentColor,
    borderBottomWidth: 1, borderBottomColor: accentColor, paddingBottom: 2, marginBottom: 6,
  };

  return (
    <Document title={`Currículo — ${p.name}`}>
      <Page size="A4" style={{ ...classic.page, fontFamily: regular }}>
        {/* Header */}
        {p.photo ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <Image src={p.photo} style={{ width: 56, height: 56, borderRadius: 28 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 22, fontFamily: bold, marginBottom: 2 }}>{p.name}</Text>
              {p.jobTitle ? <Text style={{ fontSize: 12, color: "#475569" }}>{p.jobTitle}</Text> : null}
            </View>
          </View>
        ) : (
          <View style={{ marginBottom: 4 }}>
            <Text style={{ fontSize: 22, fontFamily: bold, marginBottom: 2 }}>{p.name}</Text>
            {p.jobTitle ? <Text style={{ fontSize: 12, color: "#475569" }}>{p.jobTitle}</Text> : null}
          </View>
        )}
        {contacts.length > 0 && (
          <Text style={classic.contacts}>{contacts.join("  ·  ")}</Text>
        )}

        {/* Divider line */}
        {executiveLine
          ? <View style={{ height: 2, backgroundColor: accentColor, marginBottom: 14 }} />
          : <View style={{ borderBottomWidth: 1, borderBottomColor: "#cbd5e1", marginBottom: 14 }} />
        }

        {/* Sections */}
        {summary ? (
          <View style={classic.section}>
            <Text style={secLabel}>Resumo Profissional</Text>
            <Text style={classic.body}>{summary}</Text>
          </View>
        ) : null}

        {experiences.length > 0 ? (
          <View style={classic.section}>
            <Text style={secLabel}>Experiência Profissional</Text>
            {experiences.map((e) => <ExpBlock key={e.id} exp={e} styles={classic} bold={bold} />)}
          </View>
        ) : null}

        {education.length > 0 ? (
          <View style={classic.section}>
            <Text style={secLabel}>Formação Acadêmica</Text>
            {education.map((e) => <EduBlock key={e.id} edu={e} styles={classic} bold={bold} />)}
          </View>
        ) : null}

        {skills.length > 0 ? (
          <View style={classic.section}>
            <Text style={secLabel}>Habilidades e Competências</Text>
            <Text style={{ fontSize: 10, color: "#334155" }}>{skills.join("  ·  ")}</Text>
          </View>
        ) : null}
      </Page>
    </Document>
  );
}

/* ═══════════════════════════════════════════════════════════
   2. MODERNO — Barra topo fina · coluna única limpa
═══════════════════════════════════════════════════════════ */
const modern = StyleSheet.create({
  page:       { fontSize: 11, color: "#1e293b", padding: "0 0" },
  body:       { padding: "16 40 32" },
  section:    { marginBottom: 14 },
  bodyText:   { fontSize: 11, lineHeight: 1.5, color: "#334155" },
  expRole:    { fontSize: 11 },
  expCompany: { fontSize: 9.5, color: "#64748b", marginBottom: 2 },
  expPeriod:  { fontSize: 9, color: "#94a3b8" },
  expRow:     { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  expDesc:    { fontSize: 10, color: "#334155", marginTop: 2, lineHeight: 1.4 },
  expBlock:   { marginBottom: 8 },
});

function ModernDocument({ data }: { data: ResumeData }) {
  const { personalInfo: p, summary, experiences, education, skills, accentColor, executiveLine } = data;
  const { regular, bold } = getPdfFonts(data.fontId);
  const contacts = [p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean);

  const secLabel = {
    fontSize: 8, fontFamily: bold, textTransform: "uppercase" as const,
    letterSpacing: 1.5, color: accentColor,
    borderBottomWidth: 0.75, borderBottomColor: accentColor + "88", paddingBottom: 2, marginBottom: 6,
  };

  return (
    <Document title={`Currículo — ${p.name}`}>
      <Page size="A4" style={{ ...modern.page, fontFamily: regular }}>
        {/* Clean header — sem barra de topo */}
        <View style={{ padding: "28 40 14" }}>
          {p.photo ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 4 }}>
              <Image src={p.photo} style={{ width: 60, height: 60, borderRadius: 30 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 22, fontFamily: bold, color: "#0f172a", marginBottom: 2 }}>{p.name}</Text>
                {p.jobTitle ? <Text style={{ fontSize: 12, color: accentColor }}>{p.jobTitle}</Text> : null}
              </View>
            </View>
          ) : (
            <View>
              <Text style={{ fontSize: 22, fontFamily: bold, color: "#0f172a", marginBottom: 2 }}>{p.name}</Text>
              {p.jobTitle ? <Text style={{ fontSize: 12, color: accentColor, marginBottom: 4 }}>{p.jobTitle}</Text> : null}
            </View>
          )}
          {contacts.length > 0 && (
            <Text style={{ fontSize: 9, color: "#64748b" }}>{contacts.join("  ·  ")}</Text>
          )}
        </View>

        {/* Divider */}
        {executiveLine
          ? <View style={{ height: 1.5, backgroundColor: accentColor, marginHorizontal: 40, marginBottom: 14 }} />
          : <View style={{ borderBottomWidth: 0.75, borderBottomColor: "#cbd5e1", marginHorizontal: 40, marginBottom: 14 }} />
        }

        {/* Body */}
        <View style={modern.body}>
          {summary ? (
            <View style={modern.section}>
              <Text style={secLabel}>Resumo</Text>
              <Text style={modern.bodyText}>{summary}</Text>
            </View>
          ) : null}

          {experiences.length > 0 ? (
            <View style={modern.section}>
              <Text style={secLabel}>Experiência Profissional</Text>
              {experiences.map((e) => <ExpBlock key={e.id} exp={e} styles={modern} bold={bold} accent={accentColor} />)}
            </View>
          ) : null}

          {education.length > 0 ? (
            <View style={modern.section}>
              <Text style={secLabel}>Formação Acadêmica</Text>
              {education.map((e) => <EduBlock key={e.id} edu={e} styles={modern} bold={bold} />)}
            </View>
          ) : null}

          {skills.length > 0 ? (
            <View style={modern.section}>
              <Text style={secLabel}>Habilidades e Competências</Text>
              <Text style={{ fontSize: 10, color: "#334155" }}>{skills.join("  ·  ")}</Text>
            </View>
          ) : null}
        </View>
      </Page>
    </Document>
  );
}

/* ═══════════════════════════════════════════════════════════
   3. MINIMALISTA — Ultra limpo · só tipografia
═══════════════════════════════════════════════════════════ */
const minimal = StyleSheet.create({
  page:       { fontSize: 11, padding: "36 40", color: "#1e293b" },
  contacts:   { fontSize: 9, color: "#64748b", marginBottom: 12 },
  section:    { marginBottom: 14 },
  body:       { fontSize: 11, lineHeight: 1.5, color: "#334155" },
  expRole:    { fontSize: 11 },
  expCompany: { fontSize: 9.5, color: "#64748b", marginBottom: 2 },
  expPeriod:  { fontSize: 9, color: "#94a3b8" },
  expRow:     { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  expDesc:    { fontSize: 10, color: "#334155", marginTop: 2, lineHeight: 1.4 },
  expBlock:   { marginBottom: 8 },
});

function MinimalDocument({ data }: { data: ResumeData }) {
  const { personalInfo: p, summary, experiences, education, skills, accentColor, executiveLine } = data;
  const { regular, bold } = getPdfFonts(data.fontId);
  const contacts = [p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean);

  const secLabel = {
    fontSize: 8, fontFamily: bold, textTransform: "uppercase" as const,
    letterSpacing: 1.5, color: "#64748b", marginBottom: 6,
  };

  return (
    <Document title={`Currículo — ${p.name}`}>
      <Page size="A4" style={{ ...minimal.page, fontFamily: regular }}>
        {/* Header */}
        {p.photo ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <Image src={p.photo} style={{ width: 56, height: 56, borderRadius: 28 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20, fontFamily: bold, marginBottom: 2 }}>{p.name}</Text>
              {p.jobTitle
                ? <Text style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 2, color: accentColor }}>{p.jobTitle}</Text>
                : null}
            </View>
          </View>
        ) : (
          <View style={{ marginBottom: 4 }}>
            <Text style={{ fontSize: 20, fontFamily: bold, marginBottom: 2 }}>{p.name}</Text>
            {p.jobTitle
              ? <Text style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 2, color: accentColor }}>{p.jobTitle}</Text>
              : null}
          </View>
        )}
        {contacts.length > 0 && (
          <Text style={minimal.contacts}>{contacts.join("   |   ")}</Text>
        )}

        {/* Divider */}
        {executiveLine
          ? <View style={{ height: 2, backgroundColor: accentColor, marginBottom: 14 }} />
          : <View style={{ borderBottomWidth: 1, borderBottomColor: "#e2e8f0", marginBottom: 14 }} />
        }

        {/* Sections */}
        {summary ? (
          <View style={minimal.section}>
            <Text style={secLabel}>Resumo</Text>
            <Text style={minimal.body}>{summary}</Text>
          </View>
        ) : null}

        {experiences.length > 0 ? (
          <View style={minimal.section}>
            <Text style={secLabel}>Experiência</Text>
            {experiences.map((e) => <ExpBlock key={e.id} exp={e} styles={minimal} bold={bold} />)}
          </View>
        ) : null}

        {education.length > 0 ? (
          <View style={minimal.section}>
            <Text style={secLabel}>Formação</Text>
            {education.map((e) => <EduBlock key={e.id} edu={e} styles={minimal} bold={bold} />)}
          </View>
        ) : null}

        {skills.length > 0 ? (
          <View style={minimal.section}>
            <Text style={secLabel}>Habilidades</Text>
            <Text style={{ fontSize: 10, color: "#334155" }}>{skills.join("   |   ")}</Text>
          </View>
        ) : null}
      </Page>
    </Document>
  );
}

/* ═══════════════════════════════════════════════════════════
   4. EXECUTIVO — Refinado · espaçado · liderança
═══════════════════════════════════════════════════════════ */
const exec = StyleSheet.create({
  page:       { fontSize: 11, padding: "36 48", color: "#1e293b" },
  contacts:   { fontSize: 9, color: "#64748b", marginBottom: 12 },
  section:    { marginBottom: 16 },
  body:       { fontSize: 10.5, lineHeight: 1.6, color: "#334155" },
  expRole:    { fontSize: 11 },
  expCompany: { fontSize: 9.5, color: "#475569", marginBottom: 2 },
  expPeriod:  { fontSize: 9, color: "#94a3b8" },
  expRow:     { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  expDesc:    { fontSize: 10, color: "#334155", marginTop: 3, lineHeight: 1.45 },
  expBlock:   { marginBottom: 10 },
});

function ExecutiveDocument({ data }: { data: ResumeData }) {
  const { personalInfo: p, summary, experiences, education, skills, accentColor, executiveLine } = data;
  const { regular, bold } = getPdfFonts(data.fontId);
  const contacts = [p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean);

  const secLabel = {
    fontSize: 9, fontFamily: bold, textTransform: "uppercase" as const, letterSpacing: 1.5,
    color: "#0f172a", borderBottomWidth: 0.75, borderBottomColor: accentColor + "99", paddingBottom: 3, marginBottom: 8,
  };

  return (
    <Document title={`Currículo — ${p.name}`}>
      <Page size="A4" style={{ ...exec.page, fontFamily: regular }}>
        {/* Header — mais respiro entre elementos */}
        {p.photo ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 6 }}>
            <Image src={p.photo} style={{ width: 64, height: 64, borderRadius: 4 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 22, fontFamily: bold, textTransform: "uppercase", letterSpacing: 2, marginBottom: 5 }}>{p.name}</Text>
              {p.jobTitle ? <Text style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 1.5, color: accentColor }}>{p.jobTitle}</Text> : null}
            </View>
          </View>
        ) : (
          <View style={{ marginBottom: 6 }}>
            <Text style={{ fontSize: 22, fontFamily: bold, textTransform: "uppercase", letterSpacing: 2, marginBottom: 5 }}>{p.name}</Text>
            {p.jobTitle ? <Text style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 1.5, color: accentColor }}>{p.jobTitle}</Text> : null}
          </View>
        )}
        {contacts.length > 0 && (
          <Text style={{ ...exec.contacts, marginTop: 6 }}>{contacts.join("   ·   ")}</Text>
        )}

        {/* Divider */}
        {executiveLine
          ? <View style={{ height: 2, backgroundColor: accentColor, marginTop: 12, marginBottom: 16 }} />
          : <View style={{ borderBottomWidth: 1, borderBottomColor: "#e2e8f0", marginTop: 12, marginBottom: 16 }} />
        }

        {/* Sections */}
        {summary ? (
          <View style={exec.section}>
            <Text style={secLabel}>Resumo Profissional</Text>
            <Text style={exec.body}>{summary}</Text>
          </View>
        ) : null}

        {experiences.length > 0 ? (
          <View style={exec.section}>
            <Text style={secLabel}>Experiência Profissional</Text>
            {experiences.map((e) => <ExpBlock key={e.id} exp={e} styles={exec} bold={bold} accent={accentColor} />)}
          </View>
        ) : null}

        {education.length > 0 ? (
          <View style={exec.section}>
            <Text style={secLabel}>Formação Acadêmica</Text>
            {education.map((e) => <EduBlock key={e.id} edu={e} styles={exec} bold={bold} />)}
          </View>
        ) : null}

        {skills.length > 0 ? (
          <View style={exec.section}>
            <Text style={secLabel}>Habilidades</Text>
            <Text style={{ fontSize: 10.5, color: "#334155" }}>{skills.join("   ·   ")}</Text>
          </View>
        ) : null}
      </Page>
    </Document>
  );
}

/* ═══════════════════════════════════════════════════════════
   5. CRIATIVO — Destaque no nome · coluna única limpa
═══════════════════════════════════════════════════════════ */
const creative = StyleSheet.create({
  page:       { fontSize: 11, padding: "36 40", color: "#1e293b" },
  contacts:   { fontSize: 9, color: "#64748b", marginTop: 6 },
  section:    { marginBottom: 14 },
  bodyText:   { fontSize: 11, lineHeight: 1.55, color: "#334155" },
  expRole:    { fontSize: 11 },
  expCompany: { fontSize: 9.5, color: "#64748b", marginBottom: 2 },
  expPeriod:  { fontSize: 9, color: "#94a3b8" },
  expRow:     { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  expDesc:    { fontSize: 10, color: "#475569", marginTop: 2, lineHeight: 1.4 },
  expBlock:   { marginBottom: 8 },
});

function CreativeDocument({ data }: { data: ResumeData }) {
  const { personalInfo: p, summary, experiences, education, skills, accentColor, executiveLine } = data;
  const { regular, bold } = getPdfFonts(data.fontId);
  const contacts = [p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean);

  // Section title: underline style, sem barra lateral
  const secLabel = {
    fontSize: 8, fontFamily: bold, textTransform: "uppercase" as const,
    letterSpacing: 1.5, color: accentColor,
    borderBottomWidth: 0.75, borderBottomColor: accentColor + "55", paddingBottom: 2, marginBottom: 6,
  };

  return (
    <Document title={`Currículo — ${p.name}`}>
      <Page size="A4" style={{ ...creative.page, fontFamily: regular }}>
        {/* Clean header — no boxes */}
        {p.photo ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 4 }}>
            <Image src={p.photo} style={{ width: 60, height: 60, borderRadius: 30 }} />
            <View style={{ flex: 1 }}>
              {/* First letter in accent color */}
              <Text style={{ fontSize: 24, fontFamily: bold, marginBottom: 2 }}>{p.name}</Text>
              {p.jobTitle ? <Text style={{ fontSize: 12, color: "#475569" }}>{p.jobTitle}</Text> : null}
            </View>
          </View>
        ) : (
          <View style={{ marginBottom: 4 }}>
            <Text style={{ fontSize: 24, fontFamily: bold, marginBottom: 2 }}>{p.name}</Text>
            {p.jobTitle ? <Text style={{ fontSize: 12, color: "#475569" }}>{p.jobTitle}</Text> : null}
          </View>
        )}
        {contacts.length > 0 && (
          <Text style={creative.contacts}>{contacts.join("  ·  ")}</Text>
        )}

        {/* Divider */}
        {executiveLine
          ? <View style={{ height: 2, backgroundColor: accentColor, marginTop: 10, marginBottom: 14 }} />
          : <View style={{ borderBottomWidth: 1, borderBottomColor: "#cbd5e1", marginTop: 10, marginBottom: 14 }} />
        }

        {/* Body */}
        {summary ? (
          <View style={creative.section}>
            <Text style={secLabel}>Resumo</Text>
            <Text style={creative.bodyText}>{summary}</Text>
          </View>
        ) : null}

        {experiences.length > 0 ? (
          <View style={creative.section}>
            <Text style={secLabel}>Experiência Profissional</Text>
            {experiences.map((e) => <ExpBlock key={e.id} exp={e} styles={creative} bold={bold} accent={accentColor} />)}
          </View>
        ) : null}

        {education.length > 0 ? (
          <View style={creative.section}>
            <Text style={secLabel}>Formação Acadêmica</Text>
            {education.map((e) => <EduBlock key={e.id} edu={e} styles={creative} bold={bold} />)}
          </View>
        ) : null}

        {skills.length > 0 ? (
          <View style={creative.section}>
            <Text style={secLabel}>Habilidades e Competências</Text>
            <Text style={{ fontSize: 10, color: "#334155" }}>{skills.join("  ·  ")}</Text>
          </View>
        ) : null}
      </Page>
    </Document>
  );
}

/* ─── Public API ─── */
export async function generatePDF(data: ResumeData): Promise<Buffer> {
  let doc;
  switch (data.template) {
    case "modern":    doc = <ModernDocument    data={data} />; break;
    case "minimal":   doc = <MinimalDocument   data={data} />; break;
    case "executive": doc = <ExecutiveDocument data={data} />; break;
    case "creative":  doc = <CreativeDocument  data={data} />; break;
    default:          doc = <ClassicDocument   data={data} />; break;
  }
  return renderToBuffer(doc) as Promise<Buffer>;
}

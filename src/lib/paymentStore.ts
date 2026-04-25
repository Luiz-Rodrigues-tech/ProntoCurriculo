import { ResumeData } from "@/types/resume";

export type PaymentStatus = "pending" | "paid" | "failed";

export type PaymentSession = {
  sessionId: string;
  status: PaymentStatus;
  resumeData: ResumeData;
  paymentId?: string;
  pdfBuffer?: Buffer;
  qrCode?: string;
  pixCopyPaste?: string;
  checkoutUrl?: string;
  createdAt: number;
};

// In-memory store — for production, replace with Redis or a database.
// In serverless environments (Vercel), different function instances don't share
// this Map. For those deployments, use Upstash Redis or PlanetScale.
const sessions = new Map<string, PaymentSession>();

const TTL_MS = 30 * 60 * 1000; // 30 minutes

export const paymentStore = {
  create(sessionId: string, resumeData: ResumeData): PaymentSession {
    const session: PaymentSession = {
      sessionId,
      status: "pending",
      resumeData,
      createdAt: Date.now(),
    };
    sessions.set(sessionId, session);
    return session;
  },

  get(sessionId: string): PaymentSession | undefined {
    const session = sessions.get(sessionId);
    if (!session) return undefined;
    if (Date.now() - session.createdAt > TTL_MS) {
      sessions.delete(sessionId);
      return undefined;
    }
    return session;
  },

  update(sessionId: string, updates: Partial<PaymentSession>): void {
    const existing = sessions.get(sessionId);
    if (existing) sessions.set(sessionId, { ...existing, ...updates });
  },

  findByPaymentId(paymentId: string): PaymentSession | undefined {
    for (const session of sessions.values()) {
      if (session.paymentId === String(paymentId)) return session;
    }
    return undefined;
  },
};

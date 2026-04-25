import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { mpPayment } from "@/lib/mercadopago";
import { paymentStore } from "@/lib/paymentStore";
import { generatePDF } from "@/lib/pdfGenerator";

function validateSignature(req: NextRequest, body: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return true; // skip validation in dev if secret not set

  const xSignature = req.headers.get("x-signature") ?? "";
  const xRequestId = req.headers.get("x-request-id") ?? "";

  const parts = Object.fromEntries(
    xSignature.split(",").map((p) => p.split("=") as [string, string])
  );
  const ts = parts["ts"];
  const v1 = parts["v1"];
  if (!ts || !v1) return false;

  // MP signature template: id:<paymentId>;request-id:<xRequestId>;ts:<ts>
  // For topic=payment we use the data.id
  const manifest = `request-id:${xRequestId};ts:${ts}`;
  const computed = crypto
    .createHmac("sha256", secret)
    .update(manifest)
    .digest("hex");

  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(v1));
}

export async function POST(req: NextRequest) {
  const body = await req.text();

  if (!validateSignature(req, body)) {
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
  }

  let payload: { type?: string; data?: { id?: string } };
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  if (payload.type !== "payment" || !payload.data?.id) {
    return NextResponse.json({ ok: true }); // ignore other event types
  }

  try {
    const payment = await mpPayment.get({ id: Number(payload.data.id) });

    if (payment.status !== "approved") {
      return NextResponse.json({ ok: true });
    }

    const sessionId = payment.external_reference;
    if (!sessionId) return NextResponse.json({ ok: true });

    const session = paymentStore.get(sessionId);
    if (!session || session.status === "paid") {
      return NextResponse.json({ ok: true }); // idempotent
    }

    const pdfBuffer = await generatePDF(session.resumeData);
    paymentStore.update(sessionId, { status: "paid", pdfBuffer, paymentId: String(payment.id) });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[webhook/mercadopago]", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}

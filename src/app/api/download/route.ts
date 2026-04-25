import { NextRequest, NextResponse } from "next/server";
import { mpPayment } from "@/lib/mercadopago";
import { generatePDF } from "@/lib/pdfGenerator";
import { ResumeData } from "@/types/resume";

export async function POST(req: NextRequest) {
  try {
    const { paymentId, sessionId, resumeData } = (await req.json()) as {
      paymentId: string;
      sessionId: string;
      resumeData: ResumeData;
    };

    if (!paymentId || !resumeData) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    // Verify payment with Mercado Pago — no shared state needed
    const payment = await mpPayment.get({ id: Number(paymentId) });

    if (payment.status !== "approved") {
      return NextResponse.json({ error: "Pagamento não confirmado." }, { status: 403 });
    }

    // Optional: confirm the payment belongs to this session
    if (sessionId && payment.external_reference && payment.external_reference !== sessionId) {
      return NextResponse.json({ error: "Sessão inválida." }, { status: 403 });
    }

    const pdfBuffer = await generatePDF(resumeData);

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="curriculo.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[download]", err);
    return NextResponse.json({ error: "Erro ao gerar PDF." }, { status: 500 });
  }
}

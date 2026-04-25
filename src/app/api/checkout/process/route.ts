import { NextRequest, NextResponse } from "next/server";
import { mpPayment, PRICE, PRODUCT_DESCRIPTION } from "@/lib/mercadopago";

export async function POST(req: NextRequest) {
  try {
    const { formData, email, sessionId } = (await req.json()) as {
      formData: Record<string, unknown>;
      email: string;
      sessionId: string;
    };

    if (!formData || !email || !sessionId) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    // Only set notification_url for non-localhost (MP rejects localhost URLs)
    const isLocalhost = siteUrl.includes("localhost") || siteUrl.includes("127.0.0.1");
    const notificationUrl = isLocalhost ? undefined : `${siteUrl}/api/webhooks/mercadopago`;

    const paymentMethodId = formData.payment_method_id as string;
    const paymentTypeId = formData.payment_type_id as string | undefined;

    // ── PIX: Bricks can send payment_method_id="pix" OR payment_type_id="bank_transfer" ──
    const isPix =
      paymentMethodId === "pix" ||
      paymentTypeId === "bank_transfer" ||
      paymentMethodId === "bank_transfer";

    if (isPix) {
      const payment = await mpPayment.create({
        body: {
          transaction_amount: PRICE,
          description: PRODUCT_DESCRIPTION,
          payment_method_id: "pix",
          payer: { email },
          external_reference: sessionId,
          ...(notificationUrl ? { notification_url: notificationUrl } : {}),
        },
      });

      const txData = payment.point_of_interaction?.transaction_data;

      return NextResponse.json({
        type: "pix",
        paymentId: String(payment.id),
        qrCode: txData?.qr_code_base64 ?? "",
        pixCopyPaste: txData?.qr_code ?? "",
      });
    }

    // ── Card (credit / debit) ────────────────────────────────────────────────
    const payer = (formData.payer ?? {}) as Record<string, unknown>;

    const payment = await mpPayment.create({
      body: {
        transaction_amount: PRICE,
        description: PRODUCT_DESCRIPTION,
        token: formData.token as string,
        installments: (formData.installments as number) ?? 1,
        payment_method_id: paymentMethodId,
        issuer_id: formData.issuer_id as number | undefined,
        payer: {
          email,
          identification: payer.identification as { type: string; number: string } | undefined,
        },
        external_reference: sessionId,
        ...(notificationUrl ? { notification_url: notificationUrl } : {}),
      },
    });

    const status = payment.status;

    if (status === "approved") {
      return NextResponse.json({ type: "card", status: "approved", paymentId: String(payment.id) });
    }

    if (status === "in_process" || status === "pending") {
      return NextResponse.json({ type: "card", status: "pending", paymentId: String(payment.id) });
    }

    const detail = payment.status_detail ?? status ?? "rejected";
    return NextResponse.json({ error: `Pagamento recusado: ${detail}` }, { status: 422 });
  } catch (err) {
    console.error("[checkout/process]", err);
    return NextResponse.json({ error: "Erro ao processar pagamento." }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { mpPayment, mpPreference, PRICE, PRODUCT_DESCRIPTION } from "@/lib/mercadopago";
import { ResumeData } from "@/types/resume";

export async function POST(req: NextRequest) {
  try {
    const { method, email, sessionId, resumeData } = (await req.json()) as {
      method: "pix" | "card";
      email: string;
      sessionId: string;
      resumeData: ResumeData;
    };

    if (!sessionId || !resumeData || !email) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    // resumeData is kept client-side — the download endpoint receives it
    // directly and verifies the payment with MP before generating the PDF.
    // This makes the API stateless and safe for serverless deployments.

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    if (method === "pix") {
      const payment = await mpPayment.create({
        body: {
          transaction_amount: PRICE,
          description: PRODUCT_DESCRIPTION,
          payment_method_id: "pix",
          payer: { email },
          external_reference: sessionId,
          notification_url: `${siteUrl}/api/webhooks/mercadopago`,
        },
      });

      const txData = payment.point_of_interaction?.transaction_data;

      return NextResponse.json({
        paymentId: String(payment.id),
        qrCode: txData?.qr_code_base64 ?? "",
        pixCopyPaste: txData?.qr_code ?? "",
      });
    }

    // Card → Checkout Pro
    const preference = await mpPreference.create({
      body: {
        items: [{ id: "curriculo-pdf", title: PRODUCT_DESCRIPTION, quantity: 1, unit_price: PRICE, currency_id: "BRL" }],
        payer: { email },
        external_reference: sessionId,
        notification_url: `${siteUrl}/api/webhooks/mercadopago`,
        back_urls: {
          success: `${siteUrl}/checkout/return?session_id=${sessionId}&status=success`,
          failure: `${siteUrl}/checkout/return?session_id=${sessionId}&status=failure`,
          pending: `${siteUrl}/checkout/return?session_id=${sessionId}&status=pending`,
        },
        auto_return: "approved",
      },
    });

    return NextResponse.json({ checkoutUrl: preference.init_point });
  } catch (err) {
    console.error("[checkout]", err);
    return NextResponse.json({ error: "Erro ao criar pagamento." }, { status: 500 });
  }
}

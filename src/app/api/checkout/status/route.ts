import { NextRequest, NextResponse } from "next/server";
import { mpPayment } from "@/lib/mercadopago";

export async function GET(req: NextRequest) {
  const paymentId = req.nextUrl.searchParams.get("paymentId");
  if (!paymentId) {
    return NextResponse.json({ error: "paymentId obrigatório." }, { status: 400 });
  }

  try {
    const payment = await mpPayment.get({ id: Number(paymentId) });

    const statusMap: Record<string, string> = {
      approved: "paid",
      rejected: "failed",
      cancelled: "failed",
    };
    const status = statusMap[payment.status ?? ""] ?? "pending";

    return NextResponse.json({ status });
  } catch (err) {
    console.error("[checkout/status]", err);
    return NextResponse.json({ error: "Erro ao verificar pagamento." }, { status: 500 });
  }
}

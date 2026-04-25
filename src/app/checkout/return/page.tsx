"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function ReturnContent() {
  const params = useSearchParams();
  const router = useRouter();
  const sessionId = params.get("session_id") ?? "";
  const status = params.get("status") ?? "";

  const [message, setMessage] = useState("Verificando seu pagamento...");
  const [icon, setIcon] = useState("⏳");

  useEffect(() => {
    if (status === "failure") {
      setIcon("❌");
      setMessage("Pagamento não aprovado. Nenhum valor foi cobrado.");
      setTimeout(() => router.push("/"), 4000);
      return;
    }

    const paymentId = params.get("payment_id") ?? "";
    const storedResumeData = sessionStorage.getItem("curriculo_resume_data");
    const storedSessionId = sessionStorage.getItem("curriculo_session_id");

    if (!paymentId || !storedResumeData) {
      setIcon("⚠️");
      setMessage("Dados de pagamento não encontrados. Volte e tente novamente.");
      return;
    }

    // Immediately check if approved (for card, approval is usually instant)
    let attempts = 0;
    const poll = setInterval(async () => {
      attempts++;
      if (attempts > 20) {
        clearInterval(poll);
        setIcon("⚠️");
        setMessage("Tempo esgotado. Se o pagamento foi efetuado, entre em contato.");
        return;
      }

      const res = await fetch(`/api/checkout/status?paymentId=${paymentId}`);
      if (!res.ok) return;
      const { status: payStatus } = await res.json();

      if (payStatus === "paid") {
        clearInterval(poll);
        setIcon("✅");
        setMessage("Pagamento confirmado! Baixando seu currículo...");
        sessionStorage.removeItem("curriculo_resume_data");
        sessionStorage.removeItem("curriculo_session_id");

        const dlRes = await fetch("/api/download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentId,
            sessionId: storedSessionId ?? sessionId,
            resumeData: JSON.parse(storedResumeData),
          }),
        });
        if (dlRes.ok) {
          const blob = await dlRes.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "curriculo.pdf";
          a.click();
          URL.revokeObjectURL(url);
        }
        setTimeout(() => router.push("/"), 3000);
      }
    }, 3000);

    return () => clearInterval(poll);
  }, [sessionId, status, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 text-center shadow-lg">
        <div className="mb-4 text-5xl">{icon}</div>
        <p className="font-semibold text-slate-800">{message}</p>
        {icon === "⏳" && (
          <div className="mx-auto mt-4 h-1 w-32 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-full animate-pulse rounded-full bg-indigo-500" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutReturnPage() {
  return (
    <Suspense>
      <ReturnContent />
    </Suspense>
  );
}

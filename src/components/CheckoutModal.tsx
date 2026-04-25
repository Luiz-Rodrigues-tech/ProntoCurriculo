"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import type { IPaymentFormData } from "@mercadopago/sdk-react/esm/bricks/payment/type";
import { useResumeStore } from "@/store/resumeStore";

const PUBLIC_KEY = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!;
const PRICE = 9.9;
const POLL_INTERVAL = 3000;

type Step = "brick" | "pix" | "card-pending" | "confirmed" | "error";

/* ── helpers ── */

function Spinner({ color = "#6366f1" }: { color?: string }) {
  return (
    <div
      className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"
      style={{ borderColor: color, borderTopColor: "transparent" }}
    />
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-left text-xs transition hover:bg-slate-100"
    >
      <span className="mr-2 font-semibold text-slate-700">
        {copied ? "✓ Copiado!" : "Copiar código PIX"}
      </span>
      <span className="break-all font-mono text-[10px] text-slate-400 line-clamp-1">{text}</span>
    </button>
  );
}

/* ── main modal ── */

export default function CheckoutModal({ onClose }: { onClose: () => void }) {
  const { data, theme } = useResumeStore();
  const isDark = theme === "dark";

  const [step, setStep] = useState<Step>("brick");
  const [brickReady, setBrickReady] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [pixCopyPaste, setPixCopyPaste] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [sessionId] = useState(() => crypto.randomUUID());

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    initMercadoPago(PUBLIC_KEY, { locale: "pt-BR" });
  }, []);

  const stopPolling = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
  }, []);

  const triggerDownload = useCallback(
    async (pid: string) => {
      setStep("confirmed");
      stopPolling();
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: pid, sessionId, resumeData: data }),
      });
      if (!res.ok) {
        setStep("error");
        setErrorMsg("Pagamento confirmado, mas erro ao gerar o PDF. Entre em contato.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "curriculo.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setTimeout(onClose, 3000);
    },
    [sessionId, data, stopPolling, onClose]
  );

  const startPolling = useCallback(
    (pid: string) => {
      stopPolling();
      pollRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/checkout/status?paymentId=${pid}`);
          if (!res.ok) return;
          const { status } = await res.json();
          if (status === "paid") triggerDownload(pid);
          if (status === "failed") {
            stopPolling();
            setStep("error");
            setErrorMsg("Pagamento não confirmado. Tente novamente.");
          }
        } catch { /* ignore transient */ }
      }, POLL_INTERVAL);
    },
    [stopPolling, triggerDownload]
  );

  useEffect(() => () => stopPolling(), [stopPolling]);

  /* ── Brick onSubmit ── */
  const handleBrickSubmit = useCallback(
    ({ formData }: IPaymentFormData) => {
      // Extract email from what the Brick collected
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payer = (formData as unknown as Record<string, any>).payer as Record<string, unknown> | undefined;
      const email = (payer?.email as string) ?? data.personalInfo.email ?? "";

      return new Promise<void>((resolve, reject) => {
        fetch("/api/checkout/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          body: JSON.stringify({ formData: formData as unknown as Record<string, any>, email, sessionId }),
        })
          .then((r) => r.json())
          .then((json) => {
            if (json.error) {
              reject(new Error(json.error));
              return;
            }

            if (json.type === "pix") {
              setQrCode(json.qrCode ?? "");
              setPixCopyPaste(json.pixCopyPaste ?? "");
              startPolling(json.paymentId ?? "");
              setStep("pix");
              resolve();
              return;
            }

            // card
            if (json.status === "approved") {
              resolve();
              triggerDownload(json.paymentId ?? "");
              return;
            }

            if (json.status === "pending") {
              startPolling(json.paymentId ?? "");
              setStep("card-pending");
              resolve();
              return;
            }

            reject(new Error(json.error ?? "Pagamento recusado."));
          })
          .catch(reject);
      });
    },
    [sessionId, data.personalInfo.email, startPolling, triggerDownload]
  );

  /* ── UI ── */

  const card = isDark
    ? "bg-zinc-900 text-zinc-100"
    : "bg-white text-slate-800";

  const border = isDark ? "border-zinc-800" : "border-slate-100";
  const muted = isDark ? "text-zinc-400" : "text-slate-500";

  const stepTitle: Record<Step, string> = {
    brick: "Baixar currículo em PDF",
    pix: "Aguardando pagamento PIX",
    "card-pending": "Verificando pagamento...",
    confirmed: "Download iniciado! 🎉",
    error: "Erro no pagamento",
  };

  const stepSub: Record<Step, string> = {
    brick: "R$ 9,90 · pagamento único · sem marca d'água",
    pix: "Escaneie o QR Code ou use Copia e Cola",
    "card-pending": "Confirmando com o banco...",
    confirmed: "Obrigado pela compra!",
    error: "Algo deu errado. Tente novamente.",
  };

  return (
    /* Overlay scrollável para que o modal nunca fique cortado em telas pequenas */
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center p-4 py-8">
        <div className={`relative w-full max-w-md rounded-2xl shadow-2xl flex flex-col ${card}`}>

          {/* ── Header fixo (nunca sai da tela) ── */}
          <div className={`flex shrink-0 items-start justify-between border-b px-5 py-4 ${border}`}>
            <div className="flex-1 pr-4">
              <p className="font-bold leading-tight">{stepTitle[step]}</p>
              <p className={`text-xs mt-0.5 ${muted}`}>{stepSub[step]}</p>
            </div>
            <button
              onClick={onClose}
              className={`shrink-0 rounded-lg p-1.5 transition ${
                isDark ? "text-zinc-400 hover:bg-zinc-800" : "text-slate-400 hover:bg-slate-100"
              }`}
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>

          {/* ── Conteúdo (scrollável internamente se precisar) ── */}
          <div className="flex-1 overflow-y-auto px-5 py-5">

            {/* Brick de pagamento */}
            {step === "brick" && (
              <div>
                {!brickReady && (
                  <div className="flex flex-col items-center gap-3 py-10">
                    <Spinner color={isDark ? "#818cf8" : "#4f46e5"} />
                    <p className={`text-sm ${muted}`}>Carregando formulário seguro...</p>
                  </div>
                )}
                <div className={brickReady ? "" : "hidden"}>
                  <Payment
                    initialization={{ amount: PRICE }}
                    customization={{
                      paymentMethods: {
                        creditCard: "all",
                        debitCard: "all",
                        bankTransfer: "all",
                      },
                      visual: {
                        style: { theme: isDark ? "dark" : "default" },
                      },
                    }}
                    onReady={() => setBrickReady(true)}
                    onSubmit={handleBrickSubmit}
                    onError={(err) => {
                      console.error("[Brick error]", err);
                      setErrorMsg("Erro no formulário. Tente novamente.");
                      setStep("error");
                    }}
                  />
                </div>
              </div>
            )}

            {/* QR Code PIX */}
            {step === "pix" && (
              <div className="flex flex-col items-center gap-4">
                <div
                  className={`rounded-xl p-3 ring-1 ${
                    isDark ? "bg-zinc-800 ring-zinc-700" : "bg-slate-50 ring-slate-200"
                  }`}
                >
                  {qrCode ? (
                    <img
                      src={`data:image/png;base64,${qrCode}`}
                      alt="QR Code PIX"
                      className="h-52 w-52 rounded-lg"
                    />
                  ) : (
                    <div
                      className={`flex h-52 w-52 items-center justify-center rounded-lg text-sm ${
                        isDark ? "bg-zinc-700 text-zinc-400" : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      QR indisponível
                    </div>
                  )}
                </div>

                {pixCopyPaste && <CopyButton text={pixCopyPaste} />}

                <div className="flex items-center gap-2 text-sm text-indigo-500">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                  Aguardando confirmação do pagamento...
                </div>

                <p className={`text-center text-xs ${muted}`}>
                  O download inicia automaticamente após a confirmação.
                </p>
              </div>
            )}

            {/* Cartão pendente */}
            {step === "card-pending" && (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
                <p className={`text-sm font-medium ${isDark ? "text-zinc-300" : "text-slate-700"}`}>
                  Verificando com o banco...
                </p>
                <p className={`text-xs text-center ${muted}`}>
                  Pode levar alguns segundos.
                </p>
              </div>
            )}

            {/* Confirmado */}
            {step === "confirmed" && (
              <div className="flex flex-col items-center gap-4 py-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-4xl">
                  ✅
                </div>
                <div className="text-center">
                  <p className="font-semibold">Pagamento confirmado!</p>
                  <p className={`text-sm mt-1 ${muted}`}>Seu PDF está sendo baixado agora...</p>
                </div>
              </div>
            )}

            {/* Erro */}
            {step === "error" && (
              <div className="flex flex-col items-center gap-4 py-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-4xl">
                  ❌
                </div>
                <p className={`text-center text-sm ${isDark ? "text-red-400" : "text-red-600"}`}>
                  {errorMsg || "Ocorreu um erro. Tente novamente."}
                </p>
                <button
                  onClick={() => {
                    setStep("brick");
                    setErrorMsg("");
                    setBrickReady(false);
                  }}
                  className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
                >
                  Tentar novamente
                </button>
              </div>
            )}
          </div>

          {/* ── Footer de segurança ── */}
          {step === "brick" && (
            <div
              className={`shrink-0 border-t px-5 py-3 flex items-center justify-center gap-4 text-xs ${
                isDark ? "border-zinc-800 text-zinc-600" : "border-slate-100 text-slate-400"
              }`}
            >
              <span>🔒 SSL</span>
              <span>Mercado Pago</span>
              <span>PIX instantâneo</span>
              <span>Cartão até 12x</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

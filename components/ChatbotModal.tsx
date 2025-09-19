import React, { useEffect, useRef, useState } from "react";
import UIkit from "./UIkit";

const steps = [
  { key: "device_type", question: "Hangi cihaz?", options: ["Çamaşır Makinesi", "Bulaşık Makinesi", "Buzdolabı"] },
  { key: "brand", question: "Marka nedir?", type: "input" },
  { key: "issue", question: "Kısa şikayet", type: "textarea" },
  { key: "region", question: "Bölgeniz?", options: ["Buca", "Karabağlar", "Konak"] },
  { key: "phone", question: "Telefon (isteğe bağlı)", type: "input", optional: true },
];

export default function ChatbotModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-chatbot", handler as EventListener);
    return () => window.removeEventListener("open-chatbot", handler as EventListener);
  }, []);

  useEffect(() => {
    if (!open || !modalRef.current) return;
    const mqReduce = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!mqReduce) {
      import("gsap").then(({ gsap }) => {
        gsap.fromTo(modalRef.current, { y: 40, opacity: 0, scale: 0.98 }, { duration: 0.45, y: 0, opacity: 1, scale: 1, ease: "power3.out" });
      });
    }
  }, [open]);

  if (!open) return null;

  const current = steps[step];

  const handleNext = (val?: string) => {
    if (current.options && !val) return;
    if (!current.options && !current.optional && (!answers[current.key] && !val)) return;
    if (val !== undefined) setAnswers((p: any) => ({ ...p, [current.key]: val }));
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        device_type: answers.device_type,
        brand: answers.brand,
        issue: answers.issue,
        region: answers.region,
        phone: answers.phone || null,
        source: "chatbot",
      };
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data?.wa_url) {
        window.location.href = data.wa_url;
      } else {
        alert("Sunucu hatası. Lütfen tekrar deneyin.");
      }
    } catch (err) {
      alert("İnternet hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbackdrop" onClick={() => setOpen(false)}>
      <div className="chatmodal" onClick={(e) => e.stopPropagation()} ref={modalRef} role="dialog" aria-modal="true" aria-label="Servis Botu">
        <header className="chathead">
          <strong>Service Bot</strong>
          <button onClick={() => setOpen(false)} aria-label="Kapat" className="close">×</button>
        </header>

        <div className="chatbody">
          {step >= steps.length ? (
            <div>
              <h4>Onayla</h4>
              <ul className="summary">
                <li><strong>Cihaz:</strong> {answers.device_type}</li>
                <li><strong>Marka:</strong> {answers.brand}</li>
                <li><strong>Şikayet:</strong> {answers.issue}</li>
                <li><strong>Bölge:</strong> {answers.region}</li>
                <li><strong>Telefon:</strong> {answers.phone || "Belirtilmedi"}</li>
              </ul>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <UIkit.Button variant="primary" onClick={handleSubmit} disabled={loading}>{loading ? "Yönlendiriliyor..." : "WhatsApp ile Gönder"}</UIkit.Button>
                <UIkit.Button variant="ghost" onClick={() => { setStep(0); setAnswers({}); }}>Tekrar</UIkit.Button>
              </div>
            </div>
          ) : current.options ? (
            <div>
              <div className="q">{current.question}</div>
              <div className="opts">
                {current.options.map((o) => (
                  <UIkit.Button key={o} variant="primary" onClick={() => handleNext(o)} style={{ marginRight: 8 }}>{o}</UIkit.Button>
                ))}
              </div>
            </div>
          ) : current.type === "textarea" ? (
            <div>
              <div className="q">{current.question}</div>
              <UIkit.Textarea value={answers[current.key] || ""} onChange={(e) => setAnswers((p: any) => ({ ...p, [current.key]: e.target.value }))} />
              <div style={{ marginTop: 8 }}>
                <UIkit.Button variant="primary" onClick={() => handleNext()} disabled={!answers[current.key]}>İleri</UIkit.Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="q">{current.question}</div>
              <UIkit.Input type="text" value={answers[current.key] || ""} onChange={(e) => setAnswers((p: any) => ({ ...p, [current.key]: e.target.value }))} />
              <div style={{ marginTop: 8 }}>
                <UIkit.Button variant="primary" onClick={() => handleNext()} disabled={!current.optional && !answers[current.key]}>İleri</UIkit.Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .chatbackdrop { position: fixed; inset: 0; background: rgba(2,6,23,0.35); display:flex; align-items:center; justify-content:center; z-index: 2000; padding: 20px; }
        .chatmodal { width: 100%; max-width: 420px; background: #fff; border-radius: 12px; padding: 18px; box-shadow: 0 20px 50px rgba(2,6,23,0.12); }
        .chathead { display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px; }
        .close { background: transparent; border: none; font-size: 20px; cursor: pointer; color: #4b5563; }
        .q { font-weight: 700; margin-bottom: 10px; }
        .opts { display:flex; gap:8px; flex-wrap:wrap; }
        .summary { list-style:none; padding:0; margin:0; color:#374151; }
      `}</style>
    </div>
  );
}
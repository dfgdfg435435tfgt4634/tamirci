import React from "react";
import UIkit from "./UIkit";

export default function Hero({ onCTAClick }: { onCTAClick?: () => void }) {
  return (
    <section className="hero container" role="region" aria-label="Ana bölge">
      <div className="hero-left">
        <h1 className="hero-title">Hızlı servis. Güvenilir çözüm.</h1>
        <p className="hero-sub">İzmir — Buca / Karabağlar / Konak. Cihazınızı birkaç adımda bildirin, ekip hemen dönüş yapsın.</p>
        <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
          <UIkit.Button variant="primary" onClick={onCTAClick}>Servis Talebi Oluştur</UIkit.Button>
          <a href="https://wa.me/905314918035" target="_blank" rel="noreferrer">
            <UIkit.Button variant="ghost">Hemen WhatsApp</UIkit.Button>
          </a>
        </div>
        <ul className="hero-points" aria-hidden>
          <li>Uzman teknisyenler</li>
          <li>Orijinal yedek parça</li>
          <li>Hızlı saha müdahalesi</li>
        </ul>
      </div>

      <div className="hero-right">
        <UIkit.Card style={{ width: 320, height: 320, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <img src="/wa-logo.svg" alt="" style={{ width: 96, height: 96, marginBottom: 12 }} />
          <div style={{ display: "flex", gap: 18, color: "#0F1724", marginTop: 8 }}>
            <div style={{ textAlign: "center" }}><strong>%98</strong><div style={{ fontSize: 12, color: "var(--color-muted)" }}>Memnuniyet</div></div>
            <div style={{ textAlign: "center" }}><strong>2 saat</strong><div style={{ fontSize: 12, color: "var(--color-muted)" }}>Ortalama dönüş</div></div>
          </div>
        </UIkit.Card>
      </div>

      <style jsx>{`
        .hero { display:flex; gap:28px; align-items:center; padding: 56px 0; }
        .hero-left { flex:1; }
        .hero-right { flex:1; display:flex; justify-content:center; align-items:center; }
        .hero-title { margin: 0 0 12px; font-size: clamp(1.6rem, 3.6vw, 2.4rem); line-height: 1.04; color: var(--color-text); }
        .hero-sub { color: #4b5563; margin:0; max-width:560px; }
        .hero-points { display:flex; gap:12px; margin-top:16px; padding:0; list-style:none; color:var(--color-muted); }
        @media (max-width: 900px) {
          .hero { flex-direction: column; padding: 36px 0; text-align: center; }
          .hero-right { margin-top: 12px; }
        }
      `}</style>
    </section>
  );
}
import Head from "next/head";
import { useRef } from "react";
import Hero from "../components/Hero";
import ChatbotModal from "../components/ChatbotModal";
import UIkit from "../components/UIkit";

export default function Home() {
  const openBot = () => {
    const evt = new CustomEvent("open-chatbot");
    window.dispatchEvent(evt);
  };

  return (
    <>
      <Head>
        <title>beyaz eşya teknik servis — İzmir Buca / Karabağlar / Konak</title>
        <meta name="description" content="beyaz eşya teknik servis - İzmir (Buca, Karabağlar, Konak). Servis taleplerinizi hızlıca WhatsApp üzerinden iletin." />
      </Head>

      <header className="container header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0" }}>
        <div style={{ fontWeight: 800 }}>beyaz eşya teknik servis</div>
        <nav style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href="#services">Hizmetler</a>
          <a href="#prices">Fiyatlar</a>
          <UIkit.Button variant="ghost" onClick={openBot}>Talep Oluştur</UIkit.Button>
        </nav>
      </header>

      <main className="container">
        <Hero onCTAClick={openBot} />

        <section id="services" className="section">
          <h3>Hizmetlerimiz</h3>
          <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
            <UIkit.Card>
              <h4>Çamaşır Makinesi</h4>
              <p>Onarım & bakım.</p>
            </UIkit.Card>
            <UIkit.Card>
              <h4>Bulaşık Makinesi</h4>
              <p>Hızlı teşhis & müdahale.</p>
            </UIkit.Card>
            <UIkit.Card>
              <h4>Buzdolabı</h4>
              <p>Soğutma ve kompresör çözümleri.</p>
            </UIkit.Card>
          </div>
        </section>

        <section id="contact" className="section" style={{ marginTop: 28 }}>
          <h3>İletişim</h3>
          <p>Chatbot üzerinden talep oluşturabilir veya aşağıdaki formu kullanabilirsiniz.</p>
          <UIkit.Card style={{ maxWidth: 640 }}>
            <ContactForm />
          </UIkit.Card>
        </section>
      </main>

      <ChatbotModal />

      <footer className="footer" style={{ padding: 28, textAlign: "center", color: "var(--color-muted)" }}>
        © {new Date().getFullYear()} beyaz eşya teknik servis — İzmir (Buca / Karabağlar / Konak)
      </footer>
    </>
  );
}

function ContactForm() {
  const [payload, setPayload] = useRefState({
    device_type: "",
    brand: "",
    issue: "",
    region: "",
    phone: "",
    source: "contact_form"
  });
  const [loading, setLoading] = useRefState(false);
  const [msg, setMsg] = useRefState("");

  async function submit() {
    setMsg("");
    const p = payload();
    if (!p.device_type || !p.brand || !p.issue || !p.region) {
      setMsg("Lütfen zorunlu alanları doldurun.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p)
      });
      const data = await res.json();
      if (data.wa_url) {
        window.location.href = data.wa_url;
      } else {
        setMsg("Sunucu hatası, lütfen tekrar deneyin.");
      }
    } catch (e) {
      setMsg("Ağ hatası, lütfen tekrar deneyin.");
    }
    setLoading(false);
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <label>
        Hangi cihaz?
        <select className="form-control" value={payload().device_type} onChange={(e)=>setPayload({ ...payload(), device_type: e.target.value })}>
          <option value="">Seçiniz</option>
          <option>Çamaşır Makinesi</option>
          <option>Bulaşık Makinesi</option>
          <option>Buzdolabı</option>
        </select>
      </label>
      <label>
        Marka
        <UIkit.Input value={payload().brand} onChange={(e: any)=>setPayload({ ...payload(), brand: e.target.value })} />
      </label>
      <label>
        Şikayet
        <UIkit.Textarea value={payload().issue} onChange={(e: any)=>setPayload({ ...payload(), issue: e.target.value })} />
      </label>
      <label>
        Bölge
        <select className="form-control" value={payload().region} onChange={(e)=>setPayload({ ...payload(), region: e.target.value })}>
          <option value="">Seçiniz</option>
          <option>Buca</option>
          <option>Karabağlar</option>
          <option>Konak</option>
        </select>
      </label>
      <label>
        Telefon (isteğe bağlı)
        <UIkit.Input value={payload().phone} onChange={(e: any)=>setPayload({ ...payload(), phone: e.target.value })} />
      </label>

      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <UIkit.Button variant="primary" onClick={submit} disabled={loading()}>{loading() ? "Gönderiliyor..." : "WhatsApp ile Gönder"}</UIkit.Button>
        <UIkit.Button variant="ghost" onClick={() => { setPayload({ device_type: "", brand: "", issue: "", region: "", phone: "", source: "contact_form" }); }}>Temizle</UIkit.Button>
      </div>
      {msg() && <div style={{ color: "#d00" }}>{msg()}</div>}
    </div>
  );
}

/**
 * small helper hook: useRefState - lightweight state wrapper to avoid many useState lines in small examples
 * returns [getter, setter] as functions when used inside component scope above
 */
function useRefState<T>(initial: T) {
  const ref = useRef(initial);
  const [, s] = React.useState(0);
  const getter = () => ref.current as T;
  const setter = (v: T) => {
    ref.current = v;
    s((x) => x + 1);
  };
  return [getter, setter] as const;
}
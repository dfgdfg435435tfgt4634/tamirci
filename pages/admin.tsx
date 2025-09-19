import { useEffect, useState } from "react";

function getAuthHeader(password: string) {
  return "Basic " + btoa("admin:" + password);
}

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRequests = async (pwd: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/requests", {
        headers: { Authorization: getAuthHeader(pwd) }
      });
      if (res.status === 401) throw new Error("Yetkisiz. Şifre yanlış.");
      const data = await res.json();
      setRequests(data);
      setAuthed(true);
    } catch (e: any) {
      setError(e.message || "Hata oluştu.");
    }
    setLoading(false);
  };

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    fetchRequests(password);
  }

  async function markDone(id: string) {
    const res = await fetch(`/api/requests/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthHeader(password)
      },
      body: JSON.stringify({ whatsapp_sent: true })
    });
    if (res.ok) {
      setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, whatsapp_sent: true } : r)));
    }
  }

  if (!authed)
    return (
      <form onSubmit={handleLogin} style={{ maxWidth: 420, margin: "80px auto", padding: 20, borderRadius: 10, boxShadow: "0 10px 30px rgba(0,0,0,0.06)", background: "#fff" }}>
        <h2>Admin Panel</h2>
        <p>Yönetici şifresini girin.</p>
        <input type="password" placeholder="Yönetici Şifresi" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 6, marginBottom: 12 }} />
        <button type="submit" style={{ padding: 10, width: "100%", borderRadius: 6, background: "#25d366", color: "#0F1724", fontWeight: "bold", border: "none" }}>
          Giriş
        </button>
        {error && <div style={{ color: "#d00", marginTop: 12 }}>{error}</div>}
      </form>
    );

  return (
    <div style={{ maxWidth: 1100, margin: "28px auto", padding: 12 }}>
      <h2>Gelen Servis Talepleri</h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => fetchRequests(password)} style={{ padding: "8px 12px", borderRadius: 6 }}>Yenile</button>
      </div>
      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <div style={{ overflowX: "auto", background: "#fff", borderRadius: 8, padding: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
                <th style={{ padding: 8 }}>Cihaz</th>
                <th style={{ padding: 8 }}>Marka</th>
                <th style={{ padding: 8 }}>Şikayet</th>
                <th style={{ padding: 8 }}>Bölge</th>
                <th style={{ padding: 8 }}>Telefon</th>
                <th style={{ padding: 8 }}>Oluşturma</th>
                <th style={{ padding: 8 }}>Durum</th>
                <th style={{ padding: 8 }}>Aksiyon</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} style={{ background: r.whatsapp_sent ? "#eafee4" : "transparent", borderBottom: "1px solid #f3f3f3" }}>
                  <td style={{ padding: 8 }}>{r.device_type}</td>
                  <td style={{ padding: 8 }}>{r.brand}</td>
                  <td style={{ padding: 8 }}>{r.issue}</td>
                  <td style={{ padding: 8 }}>{r.region}</td>
                  <td style={{ padding: 8 }}>{r.phone || "Belirtilmedi"}</td>
                  <td style={{ padding: 8 }}>{new Date(r.created_at).toLocaleString("tr-TR")}</td>
                  <td style={{ padding: 8 }}>{r.whatsapp_sent ? "Tamamlandı" : "Bekliyor"}</td>
                  <td style={{ padding: 8 }}>
                    {!r.whatsapp_sent && (
                      <button onClick={() => markDone(r.id)} style={{ background: "#25d366", color: "#fff", border: "none", borderRadius: 6, padding: "6px 10px" }}>
                        Tamamlandı
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {error && <div style={{ color: "#d00", marginTop: 12 }}>{error}</div>}
    </div>
  );
}
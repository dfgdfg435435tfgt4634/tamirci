import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabase";

function isAuthorized(req: NextApiRequest) {
  const auth = req.headers.authorization;
  const pwd = process.env.ADMIN_PASSWORD;
  if (!auth || !auth.startsWith("Basic ")) return false;
  const b64 = auth.replace("Basic ", "");
  const decoded = Buffer.from(b64, "base64").toString();
  return decoded === `admin:${pwd}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isAuthorized(req)) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Admin Area"');
    return res.status(401).end("Unauthorized");
  }

  const { id } = req.query;
  if (!id || Array.isArray(id)) return res.status(400).json({ error: "Missing ID" });

  if (req.method !== "PATCH") return res.status(405).json({ error: "Method not allowed" });

  const { notes, whatsapp_sent } = req.body;
  const update: any = {};
  if (notes !== undefined) update.notes = notes;
  if (whatsapp_sent !== undefined) update.whatsapp_sent = whatsapp_sent;

  try {
    const { error } = await supabase.from("service_requests").update(update).eq("id", id);
    if (error) {
      console.error("Supabase update error:", error);
      return res.status(500).json({ error: "DB error" });
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal error" });
  }
}
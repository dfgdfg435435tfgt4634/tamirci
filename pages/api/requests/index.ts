import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabase";

function isAuthorized(req: NextApiRequest) {
  const auth = req.headers.authorization;
  const pwd = process.env.ADMIN_PASSWORD;
  if (!auth || !auth.startsWith("Basic ")) return false;
  const b64 = auth.replace("Basic ", "");
  const decoded = Buffer.from(b64, "base64").toString();
  // expects "admin:<password>"
  return decoded === `admin:${pwd}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isAuthorized(req)) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Admin Area"');
    return res.status(401).end("Unauthorized");
  }

  try {
    const { region, device_type } = req.query;

    let query = supabase.from("service_requests").select("*").order("created_at", { ascending: false });
    if (region) query = query.eq("region", region as string);
    if (device_type) query = query.eq("device_type", device_type as string);

    const { data, error } = await query;
    if (error) {
      console.error("Supabase select error:", error);
      return res.status(500).json({ error: "DB error" });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal error" });
  }
}
import type { NextApiRequest, NextApiResponse } from "next";
import { buildWaMessage, buildWaURL } from "../lib/waBuilder";

const WHATSAPP_PHONE = process.env.WHATSAPP_PHONE || "905314918035";

function maskPhone(phone?: string | null) {
  if (!phone) return null;
  const digits = String(phone).replace(/\D/g, "");
  if (!digits) return null;
  if (digits.length <= 4) return `***${digits}`;
  return `***${digits.slice(-4)}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { device_type, brand, issue, region, phone, source } = req.body ?? {};

    if (!device_type || !brand || !issue || !region) {
      return res.status(400).json({ error: "Missing required fields: device_type, brand, issue, region" });
    }

    // Generate an id for tracing (use built-in crypto if available)
    const id = typeof crypto !== "undefined" && (crypto as any).randomUUID ? (crypto as any).randomUUID() : `req_${Date.now()}`;

    const created_at = new Date().toISOString();
    const phone_masked = maskPhone(phone);

    // Server-side logging (no DB). Mask phone to protect PII.
    // In production, route these logs to a secure logging system with access control.
    console.info("[service_request]", {
      id,
      created_at,
      device_type,
      brand,
      issue,
      region,
      source: source || "chatbot",
      phone_masked,
    });

    // Build WhatsApp message and URL to return to client
    const text = buildWaMessage({ device_type, brand, issue, region, phone });
    const wa_url = buildWaURL(WHATSAPP_PHONE, text);

    return res.status(200).json({ id, wa_url });
  } catch (err) {
    console.error("requests handler error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
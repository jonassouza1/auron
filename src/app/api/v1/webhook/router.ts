import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { checkPaymentStatus } from "@/app/lib/mercadoPagoService";

const secret = process.env.WEBHOOK_SECRET as string;
const processedNotifications = new Set<string>();

function parseSignature(xSignature: string) {
  const parts = xSignature
    .split(",")
    .reduce((acc: Record<string, string>, part) => {
      const [key, value] = part.split("=");
      acc[key] = value;
      return acc;
    }, {});
  return { ts: parts.ts, receivedSignature: parts.v1 };
}

function generateSignature(dataID: string, xRequestId: string, ts: string) {
  const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`;
  return crypto.createHmac("sha256", secret).update(manifest).digest("hex");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { "x-signature": xSignature, "x-request-id": xRequestId } =
    req.headers as Record<string, string>;

  if (!xSignature || !xRequestId) {
    console.error("Missing headers", { xSignature, xRequestId });
    return res.status(400).end("Missing headers");
  }

  const { ts, receivedSignature } = parseSignature(xSignature);
  const dataID = req.body?.data?.id;

  if (!ts || !receivedSignature || !dataID) {
    console.error("Invalid webhook structure.", {
      ts,
      receivedSignature,
      dataID,
    });
    return res.status(400).end("Invalid webhook structure");
  }

  const generatedSignature = generateSignature(dataID, xRequestId, ts);
  if (generatedSignature !== receivedSignature) {
    console.error("Signature mismatch");
    return res.status(400).end("Signature mismatch");
  }

  if (!processedNotifications.has(dataID)) {
    console.log("Processing new notification", dataID);
    processedNotifications.add(dataID);
    await checkPaymentStatus(dataID);
  } else {
    console.log("Duplicate notification ignored", dataID);
  }

  res.status(200).end("OK");
}

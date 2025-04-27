import { NextResponse } from "next/server";
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

export async function POST(req: Request) {
  const headers = req.headers;
  const xSignature = headers.get("x-signature");
  const xRequestId = headers.get("x-request-id");

  if (!xSignature || !xRequestId) {
    console.error("Missing headers", { xSignature, xRequestId });
    return NextResponse.json({ message: "Missing headers" }, { status: 400 });
  }

  const { ts, receivedSignature } = parseSignature(xSignature);
  const dataID = (await req.json())?.data?.id;

  if (!ts || !receivedSignature || !dataID) {
    console.error("Invalid webhook structure.", {
      ts,
      receivedSignature,
      dataID,
    });
    return NextResponse.json(
      { message: "Invalid webhook structure" },
      { status: 400 },
    );
  }

  const generatedSignature = generateSignature(dataID, xRequestId, ts);
  if (generatedSignature !== receivedSignature) {
    console.error("Signature mismatch");
    return NextResponse.json(
      { message: "Signature mismatch" },
      { status: 400 },
    );
  }

  if (!processedNotifications.has(dataID)) {
    console.log("Processing new notification", dataID);
    processedNotifications.add(dataID);
    await checkPaymentStatus(dataID);
  } else {
    console.log("Duplicate notification ignored", dataID);
  }

  return NextResponse.json({ message: "OK" }, { status: 200 });
}

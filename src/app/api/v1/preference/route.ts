import { NextRequest, NextResponse } from "next/server";
import { getIdPreference } from "@/app/lib/mercadoPagoService";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const preferenceId = searchParams.get("id");

  if (!preferenceId) {
    return NextResponse.json(
      { error: "ID da preferência não fornecido" },
      { status: 400 },
    );
  }

  try {
    const data = await getIdPreference(preferenceId);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro na rota API:", error);
    return NextResponse.json(
      { error: "Erro ao buscar a preferência" },
      { status: 500 },
    );
  }
}

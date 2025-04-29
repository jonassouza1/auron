import { NextResponse } from "next/server";

const TOKEN = process.env.MP_ACCESS_TOKEN as string;

interface PreferenceItem {
  id?: string;
  title: string;
  description?: string;
  quantity: number;
  unit_price: number;
  currency_id?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const preferenceId = searchParams.get("id");

  if (!preferenceId) {
    return NextResponse.json(
      { error: "ID da preferência não fornecido" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `https://api.mercadopago.com/checkout/preferences/${preferenceId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Erro na requisição: ${response.status} - ${text}`);
    }

    const preferenceData = await response.json();

    const data = {
      user: {
        name: preferenceData.payer?.name ?? "",
        email: preferenceData.payer?.email ?? "",
        phone: {
          number: preferenceData.payer?.phone?.number ?? "",
        },
      },
      address: {
        zip_code: preferenceData.shipments?.receiver_address?.zip_code ?? "",
        street_name:
          preferenceData.shipments?.receiver_address?.street_name ?? "",
        street_number:
          preferenceData.shipments?.receiver_address?.street_number ?? "",
        city_name: preferenceData.shipments?.receiver_address?.city_name ?? "",
        state_name:
          preferenceData.shipments?.receiver_address?.state_name ?? "",
        country_name:
          preferenceData.shipments?.receiver_address?.country_name ?? "",
      },
      productPurchased: (preferenceData.items as PreferenceItem[]).map(
        (item) => ({
          title: item.title,
          description: item.description ?? "",
          quantity: item.quantity,
          unit_price: item.unit_price,
        }),
      ),
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro na rota API:", error);
    return NextResponse.json(
      { error: "Erro ao buscar preferência" },
      { status: 500 },
    );
  }
}

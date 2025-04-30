import { NextResponse } from "next/server";

interface PaymentItem {
  title: string;
  description: string;
  quantity: number;
  unit_price: number;
}

interface MercadoPagoItem {
  title: string;
  description: string;
  quantity: number;
  unit_price: number;
  [key: string]: unknown;
}

interface MercadoPagoPayment {
  additional_info: {
    items: MercadoPagoItem[];
  };
  [key: string]: unknown;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const payment_id = searchParams.get("id");

  if (!payment_id) {
    return NextResponse.json(
      { error: "ID de pagamento não fornecido" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${payment_id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar o pagamento");
    }

    const payment: MercadoPagoPayment = await response.json();
    console.log(payment);

    const productPurchased: PaymentItem[] = payment.additional_info.items.map(
      (item) => ({
        title: item.title,
        description: item.description,
        quantity: item.quantity,
        unit_price: Number(item.unit_price),
      }),
    );

    return NextResponse.json({ productPurchased }, { status: 200 });
  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json(
      { error: "Erro ao buscar os dados do pagamento" },
      { status: 500 },
    );
  }
}

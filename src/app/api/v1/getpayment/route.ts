import type { NextApiRequest, NextApiResponse } from "next";

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

interface ErrorResponse {
  error: string;
}

interface SuccessResponse {
  productPurchased: PaymentItem[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>,
) {
  const payment_id = req.query.id as string;

  if (!payment_id) {
    return res.status(400).json({ error: "ID de pagamento não fornecido" });
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

    const productPurchased: PaymentItem[] = payment.additional_info.items.map(
      (item) => ({
        title: item.title,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
      }),
    );

    res.status(200).json({ productPurchased });
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ error: "Erro ao buscar os dados do pagamento" });
  }
}

import { serverEmailNotification } from "@/infra/email/EmailNotification";

const TOKEN = process.env.MP_ACCESS_TOKEN as string;

async function fetchFromApi(endpoint: string) {
  const response = await fetch(`https://api.mercadopago.com${endpoint}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Erro na requisição: ${response.status} - ${text}`);
  }

  return response.json();
}

type OrderItem = {
  title: string;
  description?: string;
  quantity: number;
  unit_price: number;
};

export async function checkPaymentStatus(paymentId: string) {
  if (!paymentId) {
    console.error("ID de pagamento não fornecido");
    return;
  }

  try {
    const paymentData = await fetchFromApi(`/v1/payments/${paymentId}`);
    const status = paymentData.status;
    const orderId = paymentData.order?.id;

    if (status !== "approved") {
      console.log(`Pagamento não aprovado. Status: ${status}`);
      return;
    }

    let fullData = null;

    if (orderId) {
      const orderData = await fetchFromApi(`/merchant_orders/${orderId}`);
      const shipment = orderData.shipments?.[0];

      fullData = {
        user: {
          name: paymentData.payer?.first_name ?? "",
          email: paymentData.payer?.email ?? "",
          phone: {
            number: paymentData.payer?.phone?.number ?? "",
          },
        },
        address: {
          zip_code: shipment?.receiver_address?.zip_code ?? "",
          street_name: shipment?.receiver_address?.street_name ?? "",
          street_number: shipment?.receiver_address?.street_number ?? "",
          city_name: shipment?.receiver_address?.city_name ?? "",
          state_name: shipment?.receiver_address?.state?.name ?? "",
          country_name: shipment?.receiver_address?.country?.name ?? "",
        },
        productPurchased:
          (orderData.items as OrderItem[])?.map((item) => ({
            title: item.title,
            description: item.description ?? "",
            quantity: item.quantity,
            unit_price: item.unit_price,
          })) ?? [],
      };
    }

    await serverEmailNotification(status, fullData);
  } catch (error) {
    console.error("Erro ao verificar status do pagamento:", error);
  }
}

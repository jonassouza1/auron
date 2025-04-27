import { serverEmailNotification } from "@/components/EmailNotification";

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

export async function checkPaymentStatus(paymentId: string) {
  if (!paymentId) {
    console.error("ID de pagamento não fornecido");
    return;
  }

  try {
    const paymentData = await fetchFromApi(`/v1/payments/${paymentId}`);
    console.log("Dados do pagamento recebidos:", paymentData);
    const status = paymentData.status;
    const preferenceId = paymentData.order?.id || paymentData.preference_id;

    if (!preferenceId) {
      console.error("Preference ID não encontrado no pagamento");
      return;
    }

    const preferenceData = await fetchFromApi(
      `/checkout/preferences/${preferenceId}`,
    );

    const data = {
      user: preferenceData.payer,
      address: preferenceData.shipments?.receiver_address || {},
      productPurchased: preferenceData.items,
    };

    await serverEmailNotification(status, data);
  } catch (error) {
    console.error("Erro ao verificar status do pagamento:", error);
  }
}

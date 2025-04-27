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
    console.log("Dados do pagamento:", paymentData);

    const status = paymentData.status;

    await serverEmailNotification(status, null);
  } catch (error) {
    console.error("Erro ao verificar status do pagamento:", error);
  }
}

interface PreferenceItem {
  id?: string;
  title: string;
  description?: string;
  quantity: number;
  unit_price: number;
  currency_id?: string;
}

export async function getIdPreference(preferenceId: string) {
  if (!preferenceId) {
    console.error("ID da preferência não fornecido");
    return;
  }

  try {
    const preferenceData = await fetchFromApi(
      `/checkout/preferences/${preferenceId}`,
    );
    console.log("Dados da preferência:", preferenceData);

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

    await serverEmailNotification(null, data);

    return data;
  } catch (error) {
    console.error("Erro ao buscar a preferência:", error);
  }
}

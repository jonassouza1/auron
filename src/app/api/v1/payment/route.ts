import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

// Configuração do Mercado Pago
const TOKEN = process.env.MP_ACCESS_TOKEN!;
const client = new MercadoPagoConfig({ accessToken: TOKEN });
const preferences = new Preference(client);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Tipagem explícita para os dados do cliente e produtos
    const { customer, products } = body as {
      customer: {
        name: string;
        email: string;
        phone: string;
        address: string;
        street_number: string;
        floor: string;
        apartment: string;
        city: string;
        state: string;
        zip: string;
        country_name: string;
      };
      products: {
        productId: number;
        name: string;
        description: string;
        size: string;
        price: number;
        quantity: number;
      }[];
    };

    // Preparando os dados da preferência para o Mercado Pago
    const preferenceData = {
      payer: {
        name: customer.name,
        email: customer.email,
        phone: {
          number: customer.phone,
        },
        address: {
          street_name: customer.address,
          street_number: customer.street_number,
          floor: customer.floor,
          apartment: customer.apartment,
          city: customer.city,
          state: customer.state,
          zip_code: customer.zip,
          country: customer.country_name,
        },
      },
      items: products.map((product) => ({
        id: String(product.productId),
        title: `${product.name} - ${product.size}`,
        description: product.description,
        quantity: product.quantity,
        currency_id: "BRL",
        unit_price: Number(product.price),
      })),
      back_urls: {
        success: `${process.env.BASE_URL}/success`,
        failure: `${process.env.BASE_URL}/failure`,
        pending: `${process.env.BASE_URL}/pending`,
      },
      auto_return: "approved",
    };

    // Criando a preferência com o Mercado Pago usando a nova abordagem

    const response = await preferences.create({ body: preferenceData });

    // Retornando a URL de inicialização do pagamento
    return NextResponse.json({ init_point: response.init_point });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao criar preferência" },
      { status: 500 },
    );
  }
}

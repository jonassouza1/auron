import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { getIdPreference } from "@/lib/mercadoPagoService";
const TOKEN = process.env.MP_ACCESS_TOKEN!;
const client = new MercadoPagoConfig({ accessToken: TOKEN });
const preferences = new Preference(client);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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

    const items = products.map((product) => ({
      id: String(product.productId),
      title: `${product.name} - ${product.size}`,
      description: product.description,
      quantity: product.quantity,
      currency_id: "BRL",
      unit_price: Number(product.price),
    }));

    const shipments = {
      receiver_address: {
        zip_code: customer.zip,
        street_name: customer.address,
        street_number: Number(customer.street_number),
        floor: customer.floor,
        apartment: customer.apartment,
        city_name: customer.city,
        state_name: customer.state,
        country_name: customer.country_name,
      },
    };

    const preferenceData = {
      items,
      shipments,
      payer: {
        name: customer.name,
        email: customer.email,
        phone: {
          number: customer.phone,
        },
      },
      back_urls: {
        success: `${process.env.BASE_URL}/success`,
        failure: `${process.env.BASE_URL}/failure`,
        pending: `${process.env.BASE_URL}/pending`,
      },
      auto_return: "approved",
    };

    const response = await preferences.create({ body: preferenceData });
    if (response.id) {
      await getIdPreference(response.id);
    }

    return NextResponse.json({ init_point: response.init_point });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao criar preferência" },
      { status: 500 },
    );
  }
}

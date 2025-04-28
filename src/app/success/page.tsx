import { getIdPreference } from "@/app/lib/mercadoPagoService";
import Link from "next/link";

interface SearchParams {
  preference_id: string;
}

interface ProductPurchased {
  title: string;
  description: string;
  quantity: number;
  unit_price: number;
}

interface PreferenceData {
  productPurchased: ProductPurchased[];
}

interface SuccessPageProps {
  searchParams: SearchParams;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { preference_id } = searchParams;

  // Obtém os dados da preferência via ID
  const preferenceData = (await getIdPreference(
    preference_id,
  )) as PreferenceData | null;

  // Se os dados não existirem, podemos renderizar uma página de erro ou um fallback
  if (!preferenceData) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-red-600">
          Erro: Não encontramos os dados da sua compra.
        </h1>
        <Link
          href="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition mt-5"
        >
          Voltar para a Página Inicial
        </Link>
      </div>
    );
  }

  // Extrair apenas os dados relevantes para mostrar ao usuário
  const purchasedItems = preferenceData.productPurchased.map((item) => ({
    title: item.title,
    quantity: item.quantity,
    unit_price: item.unit_price,
    subtotal: (item.quantity * item.unit_price).toFixed(2),
  }));

  return (
    <main className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8 text-green-600 text-center">
        Compra realizada com sucesso!
      </h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Resumo da compra:</h2>
        <ul className="space-y-4">
          {purchasedItems.map((item, index) => (
            <li key={index} className="border p-4 rounded-lg shadow">
              <p>
                <strong>Produto:</strong> {item.title}
              </p>
              <p>
                <strong>Quantidade:</strong> {item.quantity}
              </p>
              <p>
                <strong>Preço unitário:</strong> R$ {item.unit_price.toFixed(2)}
              </p>
              <p>
                <strong>Subtotal:</strong> R$ {item.subtotal}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <div className="text-center mt-10">
        <Link
          href="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Voltar para a Página Inicial
        </Link>
      </div>
    </main>
  );
}

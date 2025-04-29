// src/app/pending/page.tsx

import Link from "next/link";

export default function PendingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-yellow-50 px-4 py-8 text-center">
      <div className="rounded-2xl bg-white p-8 shadow-xl max-w-md w-full">
        <div className="mb-6 flex justify-center">
          <svg
            className="h-20 w-20 text-yellow-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-yellow-600 mb-4">
          Pagamento Pendente
        </h1>
        <p className="text-gray-700 mb-6">
          Seu pagamento está em análise. Entraremos em contato assim que for
          confirmado.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-yellow-500 px-6 py-3 text-white font-semibold hover:bg-yellow-600 transition"
        >
          Voltar para a loja
        </Link>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>
          Você receberá uma atualização por e-mail sobre o status do seu
          pagamento.
        </p>
        <p className="mt-1">Obrigado pela sua paciência!</p>
      </div>
    </div>
  );
}

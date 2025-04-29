import Link from "next/link";

export default function FailurePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-red-50 px-4 py-8 text-center">
      <div className="rounded-2xl bg-white p-8 shadow-xl max-w-md w-full">
        <div className="mb-6 flex justify-center">
          <svg
            className="h-20 w-20 text-red-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856C18.07 18.464 18 17.734 18 17c0-2.761-2.239-5-5-5s-5 2.239-5 5c0 .734-.07 1.464-.207 2z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Pagamento Não Aprovado
        </h1>
        <p className="text-gray-700 mb-6">
          Algo deu errado com seu pagamento. Por favor, tente novamente ou entre
          em contato conosco.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-red-500 px-6 py-3 text-white font-semibold hover:bg-red-600 transition"
        >
          Voltar para a loja
        </Link>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>
          Se você acredita que isso foi um erro, entre em contato com nosso
          suporte.
        </p>
        <p className="mt-1">Estamos prontos para te ajudar!</p>
      </div>
    </div>
  );
}

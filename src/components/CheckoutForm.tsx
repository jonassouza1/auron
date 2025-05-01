"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

type CartItem = {
  id: number;
  name: string;
  description: string;
  size_name: string;
  price: number;
  discount_price?: number;
};

interface CheckoutFormProps {
  cartItems: CartItem[];
  quantities: { [id: number]: number };
}

const checkoutSchema = z.object({
  name: z.string().min(1, "Campo obrigatório"),
  email: z.string().email("E-mail inválido"),
  address: z.string().min(1, "Campo obrigatório"),
  street_number: z.string().min(1, "Campo obrigatório"),
  floor: z.string().optional(),
  apartment: z.string().optional(),
  city: z.string().min(1, "Campo obrigatório"),
  state: z.string().min(1, "Campo obrigatório"),
  zip: z.string().min(8, "CEP inválido").max(9, "CEP inválido"),
  country_name: z.string().optional(),
  phone: z.string().min(1, "Campo obrigatório"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutForm({
  cartItems,
  quantities,
}: CheckoutFormProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    setErrorMessage("");

    const orderData = {
      customer: data,
      products: cartItems.map((item) => ({
        productId: item.id,
        name: item.name,
        description: item.description,
        size: item.size_name,
        price: item.discount_price ?? item.price,
        quantity: quantities[item.id] ?? 1,
      })),
    };

    try {
      const response = await fetch("/api/v1/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const resData = await response.json();

      if (resData.init_point) {
        window.location.href = resData.init_point;
      } else {
        setErrorMessage("Não foi possível gerar o link de pagamento.");
      }
    } catch (error: unknown) {
      setErrorMessage(
        `Ocorreu um erro ao processar o pagamento, erro:${error}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-10 bg-white p-8 rounded-2xl shadow-md space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Finalizar Compra
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { id: "name", label: "Nome Completo", type: "text", required: true },
          { id: "email", label: "E-mail", type: "email", required: true },
          {
            id: "address",
            label: "Endereço",
            type: "text",
            required: true,
            full: true,
          },
          {
            id: "street_number",
            label: "Número",
            type: "text",
            required: true,
          },
          { id: "floor", label: "Andar (Opcional)", type: "text" },
          { id: "apartment", label: "Apartamento (Opcional)", type: "text" },
          { id: "city", label: "Cidade", type: "text", required: true },
          { id: "state", label: "Estado", type: "text", required: true },
          {
            id: "zip",
            label: "CEP",
            type: "text",
            required: true,
            maxLength: 9,
          },
          { id: "country_name", label: "País", type: "text" },
          {
            id: "phone",
            label: "Telefone",
            type: "tel",
            required: true,
            full: true,
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ].map(({ id, label, type, required, full, maxLength }) => (
          <div key={id} className={full ? "md:col-span-2" : ""}>
            <label
              htmlFor={id}
              className="block text-sm font-medium text-gray-700"
            >
              {label}
            </label>
            <input
              type={type}
              id={id}
              maxLength={maxLength}
              {...register(id as keyof CheckoutFormData)}
              className={`mt-1 block w-full rounded-xl border ${
                errors[id as keyof CheckoutFormData]
                  ? "border-red-500"
                  : "border-gray-300"
              } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
            />
            {errors[id as keyof CheckoutFormData] && (
              <p className="text-red-600 text-sm mt-1">
                {errors[id as keyof CheckoutFormData]?.message?.toString()}
              </p>
            )}
          </div>
        ))}
      </div>

      {errorMessage && (
        <p className="text-red-600 text-center font-medium">{errorMessage}</p>
      )}

      <div className="text-center mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex items-center justify-center rounded-xl px-6 py-3 text-white text-lg font-semibold transition ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isSubmitting ? "Processando..." : "Comprar"}
        </button>
      </div>
    </form>
  );
}

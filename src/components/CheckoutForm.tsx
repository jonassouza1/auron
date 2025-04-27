"use client";

import { useState } from "react";

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

export default function CheckoutForm({
  cartItems,
  quantities,
}: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    street_number: "",
    floor: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
    country_name: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const orderData = {
      customer: formData,
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

      const data = await response.json();

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        console.error("Falha ao obter o link de pagamento.");
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 bg-white p-8 rounded-2xl shadow-md space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Finalizar Compra
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nome Completo
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            E-mail
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Endereço
          </label>
          <input
            type="text"
            id="address"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="street_number"
            className="block text-sm font-medium text-gray-700"
          >
            Número
          </label>
          <input
            type="text"
            id="street_number"
            value={formData.street_number}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="floor"
            className="block text-sm font-medium text-gray-700"
          >
            Andar (Opcional)
          </label>
          <input
            type="text"
            id="floor"
            value={formData.floor}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="apartment"
            className="block text-sm font-medium text-gray-700"
          >
            Apartamento (Opcional)
          </label>
          <input
            type="text"
            id="apartment"
            value={formData.apartment}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            Cidade
          </label>
          <input
            type="text"
            id="city"
            value={formData.city}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="state"
            className="block text-sm font-medium text-gray-700"
          >
            Estado
          </label>
          <input
            type="text"
            id="state"
            value={formData.state}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="zip"
            className="block text-sm font-medium text-gray-700"
          >
            CEP
          </label>
          <input
            type="text"
            id="zip"
            value={formData.zip}
            onChange={handleChange}
            maxLength={9}
            className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="country_name"
            className="block text-sm font-medium text-gray-700"
          >
            País
          </label>
          <input
            type="text"
            id="country_name"
            value={formData.country_name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Telefone
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(XX) XXXXX-XXXX"
            className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
      </div>

      <div className="text-center mt-8">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-xl bg-green-600 px-6 py-3 text-white text-lg font-semibold hover:bg-green-700 transition"
        >
          Comprar
        </button>
      </div>
    </form>
  );
}

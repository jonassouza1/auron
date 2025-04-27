"use client";

import CheckoutForm from "@/components/CheckoutForm";
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function CartPage() {
  const { cartItems, removeFromCart } = useCart();
  const [quantities, setQuantities] = useState<{ [id: number]: number }>({});

  useEffect(() => {
    const initial = Object.fromEntries(
      cartItems.map((item) => [item.id, quantities[item.id] || 1]),
    );
    setQuantities(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems]);

  const handleQuantityChange = (id: number, value: number) => {
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const total = cartItems.reduce((acc, item) => {
    const unitPrice = item.discount_price ?? item.price;
    const quantity = quantities[item.id] ?? 1;
    return acc + unitPrice * quantity;
  }, 0);

  return (
    <main className="min-h-screen px-4 py-8 bg-gray-50 relative">
      {/* Botão de Voltar no topo esquerdo */}
      <Link
        href="/"
        className="absolute top-4 left-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition text-sm"
      >
        ← Continuar comprando
      </Link>

      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Carrinho de Compras
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600 text-center mt-10">
          Seu carrinho está vazio.
        </p>
      ) : (
        <div className="space-y-6">
          {cartItems.map((product) => {
            const unitPrice = product.discount_price ?? product.price;
            const quantity = quantities[product.id] ?? 1;
            const subtotal = unitPrice * quantity;

            return (
              <div
                key={product.id}
                className="bg-white p-4 rounded-2xl shadow flex flex-col sm:flex-row gap-4 sm:items-center relative"
              >
                {/* Imagem do produto */}
                <div className="w-full sm:w-auto flex justify-center sm:justify-start">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    width={100}
                    height={100}
                    priority
                    className="rounded-xl object-cover w-[100px] h-[100px]"
                  />
                </div>

                {/* Informações do produto */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {product.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {product.description}
                    </p>

                    <div className="mt-2 text-sm text-gray-700">
                      <span className="font-medium">Tamanho:</span>{" "}
                      {product.size_name}
                    </div>

                    <div className="mt-2 text-sm text-gray-700">
                      <label className="mr-2 font-medium">Quantidade:</label>
                      <select
                        value={quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            product.id,
                            Number(e.target.value),
                          )
                        }
                        className="border px-2 py-1 rounded text-sm"
                      >
                        {Array.from(
                          { length: product.quantity },
                          (_, i) => i + 1,
                        ).map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-2 text-sm text-gray-700">
                      Preço:
                      {product.discount_price ? (
                        <>
                          <span className="ml-1 text-red-600 font-semibold">
                            R$ {product.discount_price.toFixed(2)}
                          </span>
                          <span className="ml-2 line-through text-gray-400">
                            R$ {product.price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-green-600 font-bold">
                          R$ {product.price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 text-sm text-gray-600">
                      Subtotal:{" "}
                      <span className="font-medium text-gray-800">
                        R$ {subtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Botão remover */}
                  <div className="mt-4 sm:mt-0 sm:absolute sm:top-4 sm:right-4">
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="text-sm text-red-600 hover:underline hover:cursor-pointer"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Total geral */}
          <div className="text-right mt-6 text-lg font-semibold text-gray-800">
            Total: R$ {total.toFixed(2)}
          </div>
        </div>
      )}

      {cartItems.length > 0 && (
        <>
          <div className="text-right mt-6 text-lg font-semibold text-gray-800">
            Total: R$ {total.toFixed(2)}
          </div>

          {/* Formulário de checkout */}
          <CheckoutForm cartItems={cartItems} quantities={quantities} />
        </>
      )}
    </main>
  );
}

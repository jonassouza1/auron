"use client";

import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function CartPage() {
  const { cartItems, removeFromCart } = useCart();

  const [quantities, setQuantities] = useState<{ [id: number]: number }>({});

  useEffect(() => {
    // Inicializa quantidades com 1 se ainda não tiver valor
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
    <main className="min-h-screen px-4 py-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Carrinho de Compras
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Seu carrinho está vazio.</p>
      ) : (
        <div className="space-y-6">
          {cartItems.map((product) => {
            const unitPrice = product.discount_price ?? product.price;
            const quantity = quantities[product.id] ?? 1;
            const subtotal = unitPrice * quantity;

            return (
              <div
                key={product.id}
                className="bg-white p-4 rounded-2xl shadow flex flex-col sm:flex-row gap-4 sm:items-center"
              >
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={100}
                  height={100}
                  className="rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-500">{product.description}</p>

                  {/* Tamanho (estático) */}
                  <div className="mt-2 text-sm text-gray-700">
                    <span className="font-medium">Tamanho:</span>{" "}
                    <span>{product.size}</span>
                  </div>

                  {/* Select de quantidade */}
                  <div className="mt-2 text-sm text-gray-700">
                    <label className="mr-2 font-medium">Quantidade:</label>
                    <select
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(product.id, Number(e.target.value))
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

                  {/* Preço */}
                  <div className="mt-2 text-sm text-gray-700 flex items-center gap-2">
                    <span>
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
                        <span className="ml-1 font-semibold">
                          R$ {product.price.toFixed(2)}
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Subtotal */}
                  <div className="mt-3 text-sm text-gray-600">
                    Subtotal:{" "}
                    <span className="font-medium text-gray-800">
                      R$ {subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="text-sm text-red-600 hover:underline ml-auto"
                >
                  Remover
                </button>
              </div>
            );
          })}

          {/* Total Geral */}
          <div className="text-right mt-6 text-lg font-semibold text-gray-800">
            Total: R$ {total.toFixed(2)}
          </div>
        </div>
      )}

      <div className="text-right">
        <Link
          href="/"
          className="inline-block mt-6 bg-gray-800 text-white px-6 py-2 rounded-xl hover:bg-gray-700 transition"
        >
          Continuar comprando
        </Link>
      </div>
    </main>
  );
}

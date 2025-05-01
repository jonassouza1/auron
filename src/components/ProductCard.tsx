"use client";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext"; // ajuste o caminho conforme necessário

type Product = {
  id: number;
  name: string;
  image_url: string;
  description: string;
  quantity: number;
  price: number;
  discount_price?: number;
  size_name: string;
};

export default function ProductCard({ product }: { product: Product }) {
  const { cartItems, addToCart } = useCart();

  const hasDiscount = !!product.discount_price;
  const isInCart = cartItems.some((item) => item.id === product.id);

  return (
    <div className="bg-white rounded-2xl shadow p-4 hover:shadow-lg transition">
      <div className="relative w-full h-48 mb-4">
        <Image
          src={product.image_url}
          alt={product.name}
          quality={100}
          fill
          priority={product.image_url === "/calca_legging.jpg"}
          sizes="(max-width: 768px) 100vw, 400px"
          className="rounded-xl object-contain object-center bg-white"
        />
      </div>

      <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>

      <p className="text-sm text-gray-500 mb-2 line-clamp-2">
        {product.description}
      </p>

      {/* Adiciona a exibição do tamanho (se existir) */}
      {
        <div className="text-sm text-gray-700 mt-2">
          <span className="font-medium">Tamanho:</span> {product.size_name}
        </div>
      }

      <div className="flex items-center gap-2 mb-1">
        {hasDiscount ? (
          <>
            <span className="text-red-600 font-bold">
              R$ {product.discount_price!.toFixed(2)}
            </span>
            <span className="text-gray-400 line-through">
              R$ {product.price.toFixed(2)}
            </span>
          </>
        ) : (
          <span className="text-green-600 font-bold">
            R$ {product.price.toFixed(2)}
          </span>
        )}
      </div>

      <p className="text-xs text-gray-500 mb-2">
        {product.quantity > 0
          ? `${product.quantity} unidades em estoque`
          : "Fora de estoque"}
      </p>

      <button
        onClick={() => addToCart(product)}
        className="w-full bg-gray-800 text-white py-2 rounded-xl hover:bg-gray-700 disabled:bg-gray-400 hover:cursor-pointer"
        disabled={product.quantity === 0 || isInCart}
      >
        {isInCart ? "Já está no carrinho" : "Adicionar ao carrinho"}
      </button>
    </div>
  );
}

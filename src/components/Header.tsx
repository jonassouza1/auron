"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/context/CartContext";

export default function Header() {
  const { cartItems } = useCart();

  return (
    <header className="flex items-center justify-between p-4 shadow bg-white">
      <h1 className="text-xl font-bold text-gray-800">Auron</h1>

      <Link href="/cart" className="relative">
        <ShoppingCart className="w-6 h-6 text-gray-700" />
        {cartItems.length > 0 && (
          <span className="absolute top-[-6px] right-[-6px] bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-medium shadow">
            {cartItems.length}
          </span>
        )}
      </Link>
    </header>
  );
}

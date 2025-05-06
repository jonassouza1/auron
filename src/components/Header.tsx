"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { useEffect, useState } from "react";

export default function Header() {
  const { cartItems } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkLoginStatus() {
      try {
        const res = await fetch("/api/v1/auth/me", { credentials: "include" });

        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setIsLoggedIn(false);
      }
    }

    checkLoginStatus();
  }, []);

  return (
    <>
      <header className="flex items-center justify-between p-4 pr-16 shadow bg-white">
        <h1 className="text-xl font-bold text-gray-800">Auron</h1>

        <nav className="flex gap-4 items-center">
          {isLoggedIn ? (
            <Link
              href="/me"
              className="text-gray-700 hover:text-gray-900 transition font-medium"
            >
              👤 Perfil
            </Link>
          ) : (
            <Link
              href="/auth"
              className="text-gray-700 hover:text-gray-900 transition font-medium"
            >
              Entrar / Cadastrar
            </Link>
          )}
        </nav>
      </header>

      <Link
        href="/cart"
        className="fixed top-4 right-4 z-50 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition"
      >
        <div className="relative">
          <ShoppingCart className="w-6 h-6 text-gray-700" />
          {cartItems.length > 0 && (
            <span className="absolute top-[-6px] right-[-6px] bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-medium shadow">
              {cartItems.length}
            </span>
          )}
        </div>
      </Link>
    </>
  );
}

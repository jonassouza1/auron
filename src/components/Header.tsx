"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { useEffect, useState } from "react";

export default function Header() {
  const { cartItems } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    async function checkLoginStatus() {
      try {
        const res = await fetch("/api/v1/auth/me", { credentials: "include" });
        setIsLoggedIn(res.ok);
      } catch {
        setIsLoggedIn(false);
      }
    }

    checkLoginStatus();
  }, []);

  async function handleLogout() {
    await fetch("/api/v1/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setIsLoggedIn(false);
    setShowMenu(false);
  }

  return (
    <>
      <header className="flex items-center justify-between p-4 pr-16 shadow bg-white">
        <h1 className="text-xl font-bold text-gray-800">Auron</h1>

        <nav className="flex gap-4 items-center relative">
          {isLoggedIn ? (
            <div
              className="relative"
              onMouseEnter={() => setShowMenu(true)}
              onMouseLeave={() => setShowMenu(false)}
            >
              <button className="text-gray-700 hover:text-gray-900 transition font-medium">
                👤 Perfil
              </button>

              {showMenu && (
                <div className="absolute top-full mt-2 right-0 bg-white shadow-md rounded-md w-32 z-50 border">
                  <Link
                    href="/me"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-800"
                  >
                    Minha conta
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
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

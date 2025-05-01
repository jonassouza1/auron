import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/app/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d6efd",
};

export const metadata: Metadata = {
  title: "AURA | As Melhores Ofertas Online",
  description:
    "Descubra promoções incríveis em roupas no AURA. Entrega rápida e segura para todo o Brasil!",
  keywords: ["ecommerce", "compras online", "roupas", "promoções"],
  authors: [{ name: "Jonas Souza", url: "https://jonassouza1.github.io" }],
  creator: "Jonas Souza",
  robots: "index, follow",
  openGraph: {
    title: "AURON | As Melhores Ofertas Online",
    description: "Descubra promoções incríveis em roupas.",
    url: "https://jonassouza1.github.io/ecommercejs-frontend-site/",
    siteName: "AURON",
    images: [
      {
        url: "https://jonassouza1.github.io/ecommercejs-frontend-site/og-image.jpg", // coloque uma imagem representativa da sua home
        width: 1200,
        height: 630,
        alt: "AURA",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AURA | As Melhores Ofertas Online",
    description: "Descubra promoções incríveis em roupas.",
    images: [
      "https://jonassouza1.github.io/ecommercejs-frontend-site/og-image.jpg",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Menuza — On-Chain Digital Menu for Restaurants",
  description:
    "Decentralized, live digital menu application for restaurants, cafés and food vendors powered by Botchain Mainnet.",
  keywords: ["Web3", "Restaurant Menu", "Botchain", "Solidity", "Digital Menu", "Decentralized", "BOT Chain"],
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-charcoal-900 text-cream-50 antialiased selection:bg-terracotta-500 selection:text-charcoal-950">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}


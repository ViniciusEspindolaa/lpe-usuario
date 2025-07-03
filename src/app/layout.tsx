import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { UsuarioProvider } from "@/context/UsuarioContext";
import { Toaster } from "sonner";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "Avenida Reviews",
  description: "Reviews de Games",
  keywords: ["reviews", "games", "jogos", "avaliações"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`bg-black text-white ${orbitron.className}`}>
        <UsuarioProvider>
          <Header />
          <main>{children}</main>
          <Toaster richColors position="top-center" />
        </UsuarioProvider>
      </body>
    </html>
  );
}
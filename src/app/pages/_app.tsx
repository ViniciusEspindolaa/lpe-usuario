import type { AppProps } from "next/app";
import { UsuarioProvider } from "@/context/UsuarioContext";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UsuarioProvider>
      <Component {...pageProps} />
    </UsuarioProvider>
  );
}
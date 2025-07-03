// frontend/src/components/Header.tsx
"use client";
import { useUsuarioStore } from "@/context/UsuarioContext";
// import { useRouter } from "next/navigation"; // Não precisaremos mais do useRouter para o logout forçado
import Link from "next/link";
import { Suspense } from "react";

function HeaderContent() {
  const { usuario, deslogaUsuario } = useUsuarioStore();
  // const router = useRouter(); // Você pode comentar ou remover esta linha se não a usa para mais nada

  function usuarioSair() {
    if (confirm("Confirma saída do sistema?")) {
      // 1. Limpa o estado do Zustand e do localStorage
      deslogaUsuario();

      // 2. **SOLUÇÃO FINAL**: Forçar um recarregamento COMPLETO da página para o login.
      // Isso é crucial para bypassar o cache do Next.js e garantir que todos os estados
      // e componentes sejam reinicializados a partir de um localStorage vazio.
      window.location.href = "/login";
      // Se você quisesse apenas recarregar a página atual para zerar tudo:
      // window.location.reload();
    }
  }

  // ... o restante do seu componente HeaderContent é o mesmo

  return (
    <nav className="border-red-950 bg-black dark:bg-red-950 dark:border-red-900 border-b-2">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="./logo.png" className="h-12" alt="Logo Avenida Reviews" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Avenida Reviews
          </span>
        </Link>
        <button
          data-collapse-toggle="navbar-solid-bg"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-solid-bg"
          aria-expanded="false"
        >
          <span className="sr-only">Abrir menu principal</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
          <ul className="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
            <li className="flex items-center space-x-4">
              {usuario?.id ? (
                <>
                  <span className="text-white">{usuario.nome}</span>
                  <Link
                    href="/avaliacoes"
                    className="text-white font-bold bg-red-800 hover:bg-red-600 focus:ring-2 focus:outline-none focus:ring-blue-300 rounded-lg text-sm w-full sm:w-auto px-3 py-2 text-center dark:bg-red-800 dark:hover:bg-red-600 dark:focus:ring-blue-800"
                  >
                    Minhas Avaliações
                  </Link>
                  <span
                    className="cursor-pointer font-bold text-gray-400 hover:text-gray-200"
                    onClick={usuarioSair}
                  >
                    Sair
                  </span>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block py-2 px-3 md:p-0 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Identifique-se
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default function Header() {
  return (
    <Suspense fallback={<div className="bg-black h-16"></div>}>
      <HeaderContent />
    </Suspense>
  );
}
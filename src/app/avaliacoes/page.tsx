// frontend/src/app/avaliacoes/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useUsuarioStore } from "@/context/UsuarioContext";
import { toast } from "sonner";
import Link from "next/link";
import { loadData } from "../../utils/api";

type Avaliacao = {
  id: string;
  comentario: string;
  nota: number;
  usuarioId: string;
  jogoId: number;
  usuario: { nome: string };
  jogo: { nome: string };
  createdAt: string;
  resposta: string;
};

export default function MinhasAvaliacoes() {
  const { usuario } = useUsuarioStore();
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [erro, setErro] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchAvaliacoes() {
      if (!usuario?.id) {
        setErro("Faça login para ver suas avaliações");
        toast.error("Faça login para ver suas avaliações");
        return;
      }

      setIsLoading(true);
      try {
        console.log("Buscando avaliações para usuarioId:", usuario.id);
        const data = await loadData({ usuarioId: usuario.id ?? undefined });
        setAvaliacoes(data);
        setErro("");
      } catch (error) {
        console.error("Erro ao buscar avaliações:", error);
        const mensagem =
          typeof error === "object" && error !== null && "message" in error
            ? String((error as { message?: unknown }).message)
            : "Erro ao carregar avaliações";
        toast.error(mensagem);
        setErro(mensagem);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAvaliacoes();
  }, [usuario]);

  if (isLoading) {
    return <div className="text-white bg-black text-center">Carregando...</div>;
  }

  return (
    <section className="min-h-screen bg-black py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-white mb-4">Minhas Avaliações</h2>
        {erro && <p className="text-red-500">{erro}</p>}
        {!usuario?.id ? (
          <p className="text-white text-sm">
            😎 <Link href="/login" className="text-blue-500 hover:underline">Faça login</Link> para ver suas avaliações!
          </p>
        ) : avaliacoes.length === 0 && !erro ? (
          <p className="text-zinc-400 text-sm">Você ainda não fez nenhuma avaliação.</p>
        ) : (
          <div className="space-y-4">
            {avaliacoes.map((avaliacao) => (
              <div key={avaliacao.id} className="bg-zinc-800 border border-red-800 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-white font-semibold">Jogo: {avaliacao.jogo.nome}</p>
                  <p className="text-sm text-red-400">Nota: {avaliacao.nota}/10</p>
                </div>
                <p className="text-sm text-zinc-300 mt-2">{avaliacao.comentario}</p>
                <p className="text-xs text-zinc-400 mt-1">
                  Avaliado em: {new Date(avaliacao.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
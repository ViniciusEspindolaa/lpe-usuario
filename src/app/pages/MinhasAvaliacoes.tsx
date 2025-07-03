"use client";
import { useEffect, useState, Suspense } from "react";
import { useUsuarioStore } from "@/context/UsuarioContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Avaliacao = {
  id: number;
  nota: number;
  comentario: string;
  resposta?: string;
  createdAt: string;
  jogo: {
    id: number;
    nome: string;
    genero: { nome: string };
  };
};

function MinhasAvaliacoesContent() {
  const { usuario } = useUsuarioStore();
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchAvaliacoes() {
      if (!usuario?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/avaliacoes/${usuario.id}`);
        if (response.status === 200) {
          const data = await response.json();
          setAvaliacoes(data);
        } else {
          const errorData = await response.json();
          toast.error(errorData.erro || "Erro ao carregar avaliações");
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
        toast.error("Erro de conexão com o servidor");
      } finally {
        setLoading(false);
      }
    }

    fetchAvaliacoes();
  }, [usuario, router]);

  const formatarData = (data: string) => {
    try {
      return new Date(data).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return data;
    }
  };

  if (!usuario?.id) {
    toast.error("Faça login para ver suas avaliações");
    router.push("/login");
    return null;
  }

  return (
    <section className="min-h-screen bg-black dark:bg-black py-8">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-white mb-6">Minhas Avaliações</h1>
        {loading ? (
          <p className="text-white">Carregando...</p>
        ) : avaliacoes.length === 0 ? (
          <p className="text-white text-sm">
            Nenhuma avaliação encontrada.{" "}
            <Link href="/jogos" className="text-blue-500 hover:underline">
              Avalie um jogo agora!
            </Link>
          </p>
        ) : (
          <div className="space-y-4">
            {avaliacoes.map((avaliacao) => (
              <div
                key={avaliacao.id}
                className="bg-zinc-900 border border-red-950 rounded-lg p-6 shadow-sm hover:shadow-red-900/20 transition-all duration-300"
              >
                <h2 className="text-xl font-semibold text-white">
                  {avaliacao.jogo.nome} ({avaliacao.jogo.genero.nome})
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Nota: {avaliacao.nota}/10
                </p>
                <p className="text-sm text-zinc-300 mt-2">
                  <span className="text-red-400 font-medium">Comentário:</span>{" "}
                  {avaliacao.comentario}
                </p>
                {avaliacao.resposta && (
                  <p className="text-sm text-zinc-300 mt-2">
                    <span className="text-red-400 font-medium">Resposta:</span>{" "}
                    {avaliacao.resposta}
                  </p>
                )}
                <p className="text-xs text-zinc-500 mt-2">
                  Avaliado em: <span data-testid="data-avaliacao">{formatarData(avaliacao.createdAt)}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function MinhasAvaliacoes() {
  return (
    <Suspense fallback={<div className="text-white bg-black">Carregando...</div>}>
      <MinhasAvaliacoesContent />
    </Suspense>
  );
}
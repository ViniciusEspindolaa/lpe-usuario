// frontend/src/app/detalhes/[jogo_id]/page.tsx
"use client";
import { JogoItf } from "@/utils/types/JogoItf";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useUsuarioStore } from "@/context/UsuarioContext";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";
import { Suspense } from "react";

type Inputs = {
  comentario: string;
  nota: number;
};

type Avaliacao = {
  id: string;
  comentario: string;
  nota: number;
  usuarioId: string;
  usuario: { nome: string };
  createdAt: string;
};

function DetalhesContent() {
  const params = useParams();
  const [jogo, setJogo] = useState<JogoItf | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [mediaNota, setMediaNota] = useState<number | null>(null);
  const { usuario } = useUsuarioStore();
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const jogoId = Array.isArray(params?.jogo_id) ? params.jogo_id[0] : params.jogo_id;

  useEffect(() => {
    async function loadData() {
      if (!jogoId) {
        toast.error("ID do jogo inválido");
        return;
      }

      try {
        // Buscar dados do jogo
        const jogoResponse = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/jogos/${jogoId}`);
        if (!jogoResponse.ok) {
          throw new Error(`Erro ao buscar jogo: ${jogoResponse.statusText}`);
        }
        const dadosJogo = await jogoResponse.json();
        setJogo(dadosJogo);

        // Buscar avaliações do jogo
        const avaliacoesResponse = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/avaliacoes?jogoId=${jogoId}`);
        if (!avaliacoesResponse.ok) {
          throw new Error(`Erro ao buscar avaliações: ${avaliacoesResponse.statusText}`);
        }
        const dadosAvaliacoes: Avaliacao[] = await avaliacoesResponse.json();
        setAvaliacoes(dadosAvaliacoes);
        // Calcular média das notas
        if (dadosAvaliacoes.length > 0) {
          const media = dadosAvaliacoes.reduce((sum, av) => sum + av.nota, 0) / dadosAvaliacoes.length;
          setMediaNota(Number(media.toFixed(1)));
        } else {
          setMediaNota(null);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro de conexão com o servidor");
      }
    }
    loadData();
  }, [jogoId]);

  async function enviaAvaliacao(data: Inputs) {
    if (!usuario?.id) {
      toast.error("Faça login para enviar uma avaliação");
      return;
    }

    if (!data.comentario.trim()) {
      toast.error("O comentário é obrigatório");
      return;
    }

    const jogoIdNum = Number(jogoId);
    if (isNaN(jogoIdNum)) {
      toast.error("ID do jogo inválido");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/avaliacoes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuarioId: usuario.id,
          jogoId: jogoIdNum,
          comentario: data.comentario,
          nota: Number(data.nota),
          resposta: "Nenhuma resposta", // Include default resposta as per schema
        }),
      });

      if (response.status === 201) {
        toast.success("Avaliação enviada com sucesso!");
        reset();
        // Atualizar avaliações
        const avaliacoesResponse = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/avaliacoes?jogoId=${jogoId}`);
        if (!avaliacoesResponse.ok) {
          throw new Error(`Erro ao atualizar avaliações: ${avaliacoesResponse.statusText}`);
        }
        const dadosAvaliacoes: Avaliacao[] = await avaliacoesResponse.json();
        setAvaliacoes(dadosAvaliacoes);
        // Recalcular média
        if (dadosAvaliacoes.length > 0) {
          const media = dadosAvaliacoes.reduce((sum, av) => sum + av.nota, 0) / dadosAvaliacoes.length;
          setMediaNota(Number(media.toFixed(1)));
        } else {
          setMediaNota(null);
        }
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.erro?.issues
          ? errorData.erro.issues.map((issue: { message: string }) => issue.message).join(", ")
          : errorData.erro || "Erro ao enviar avaliação";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      toast.error("Erro de conexão com o servidor");
    }
  }

  // Determinar a cor do bloco da média
  const getMediaColor = (media: number) => {
    if (media >= 8) return "bg-green-600";
    if (media >= 5) return "bg-yellow-600";
    return "bg-red-600";
  };

  if (!jogo) {
    return <div className="text-white bg-black text-center">Carregando...</div>;
  }

  return (
    <section className="min-h-screen bg-black py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center bg-zinc-900 border border-red-800 rounded-lg shadow-sm hover:shadow-red-900/20 transition-all duration-300">
          {jogo.foto && (
            <div className="relative w-full md:w-1/2 h-96 md:h-auto">
              <img
                className="object-cover w-full h-full rounded-t-lg md:rounded-none md:rounded-s-lg"
                src={jogo.foto}
                alt={`Capa do jogo ${jogo.nome}`}
              />
              <span className="absolute bottom-2 right-2 bg-red-800 text-white text-xs font-semibold px-2.5 py-1 rounded shadow-md border border-red-600">
                {jogo.genero.nome}
              </span>
            </div>
          )}
          <div className="flex flex-col justify-between p-6 leading-normal w-full text-white space-y-3">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-center md:text-left mb-4 text-white">
              {jogo.nome}
            </h1>
            <div className="text-sm text-zinc-300">
              <span className="font-semibold text-red-400">Ano:</span> {jogo.ano}
            </div>
            <div className="text-sm text-zinc-300">
              <span className="font-semibold text-red-400">Desenvolvedora:</span> {jogo.desenvolvedora}
            </div>
            <div className="text-sm text-zinc-300">
              <span className="font-semibold text-red-400">Publicadora:</span> {jogo.publicadora}
            </div>
            <div className="text-sm text-zinc-300">
              <span className="font-semibold text-red-400">Plataforma:</span> {jogo.plataforma}
            </div>
            <p className="mt-2 text-zinc-300 text-sm border-t pt-4 border-red-800/30">
              <span className="text-red-400 font-medium">Descrição:</span> {jogo.descricao}
            </p>
            {mediaNota !== null && (
              <div className="text-sm text-zinc-300 mt-2">
                <span className="font-semibold text-red-400">Média:</span>{" "}
                <span className={`inline-block text-white text-sm font-semibold px-2 py-1 rounded ${getMediaColor(mediaNota)}`}>
                  {mediaNota}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-zinc-900 border border-red-800 rounded-lg shadow-sm p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Avaliações</h2>
          {usuario?.id ? (
            <>
              <h3 className="text-lg font-semibold text-white mb-2">
                🙂 Deixe sua avaliação para {jogo.nome}!
              </h3>
              <form onSubmit={handleSubmit(enviaAvaliacao)} className="space-y-4">
                <input
                  type="text"
                  className="w-full p-2.5 text-sm text-gray-400 bg-zinc-800 border border-red-800 rounded-lg dark:placeholder-red-700"
                  value={`${usuario.nome} (${usuario.email})`}
                  disabled
                  readOnly
                />
                <textarea
                  id="comentario"
                  className="w-full p-2.5 text-sm text-white bg-zinc-800 border border-red-800 rounded-lg focus:ring-red-500 focus:border-red-500 dark:placeholder-red-700"
                  placeholder="Escreva seu comentário"
                  required
                  {...register("comentario")}
                />
                <div>
                  <label htmlFor="nota" className="block mb-2 text-sm font-medium text-white">
                    Nota (0-10)
                  </label>
                  <select
                    id="nota"
                    className="w-full p-2.5 text-sm text-white bg-zinc-800 border border-red-800 rounded-lg focus:ring-red-500 focus:border-red-500"
                    required
                    {...register("nota", { valueAsNumber: true })}
                  >
                    {[...Array(11)].map((_, i) => (
                      <option key={i} value={i} className="bg-zinc-800">
                        {i}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-red-800 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Enviar Avaliação
                </button>
              </form>
            </>
          ) : (
            <p className="text-white text-sm">
              😎 Gostou? <Link href="/login" className="text-blue-500 hover:underline">Faça login</Link> para deixar sua avaliação!
            </p>
          )}
          {/* Lista de Avaliações */}
          {avaliacoes.length > 0 ? (
            <div className="mt-6 space-y-4">
              {avaliacoes.map((avaliacao) => (
                <div
                  key={avaliacao.id}
                  className="bg-zinc-800 border border-red-800 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-white font-semibold">
                      {avaliacao.usuario.nome}
                    </p>
                    <p className="text-sm text-red-400">
                      Nota: {avaliacao.nota}/10
                    </p>
                  </div>
                  <p className="text-sm text-zinc-300 mt-2">
                    {avaliacao.comentario}
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Avaliado em: {new Date(avaliacao.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-400 text-sm mt-4">
              Nenhuma avaliação para este jogo ainda.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default function Detalhes() {
  return (
    <Suspense fallback={<div className="text-white bg-black">Carregando...</div>}>
      <DetalhesContent />
    </Suspense>
  );
}
'use client'
import './page.css'
import { useEffect, useState } from "react";
import { useUsuarioStore } from "@/context/UsuarioContext";
import { AvaliacaoItf } from "@/utils/types/AvaliacaoItf";

export default function Comentarios() {
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoItf[]>([])
  const { usuario } = useUsuarioStore()

  useEffect(() => {
    async function buscaDados() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/avaliacoes/${usuario.id}`)
      const dados = await response.json()
      setAvaliacoes(dados)
    }
    buscaDados()
  }, [])

  // para retornar apenas a data do campo no banco de dados
  // 2024-10-10T22:46:27.227Z => 10/10/2024
  function dataDMA(data: string) {
    const ano = data.substring(0, 4)
    const mes = data.substring(5, 7)
    const dia = data.substring(8, 10)
    return dia + "/" + mes + "/" + ano
  }

  const avaliacoesTable = avaliacoes.map(avaliacao => (
  <tr
    key={avaliacao.id}
    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
  >
    <th
      scope="row"
      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
    >
      <p>
        <b>{avaliacao.jogo.nome}</b>
      </p>
      <p className="mt-3">
        Gênero: {typeof avaliacao.jogo.genero === 'string' ? avaliacao.jogo.genero : avaliacao.jogo.genero.nome} - Plataforma: {avaliacao.jogo.plataforma}
      </p>
    </th>
    <td className="px-6 py-4">
      <img
        src={avaliacao.jogo.foto}
        className="fotoJogo"
        alt={`Capa do jogo ${avaliacao.jogo.nome}`}
        style={{ width: '100px', height: 'auto' }} // Ajuste o tamanho conforme necessário
      />
    </td>
    <td className="px-6 py-4">
      <p>
        <b>{avaliacao.descricao}</b>
      </p>
      <p>
        <i>Enviado em: {dataDMA(avaliacao.createdAt)}</i>
      </p>
    </td>
  </tr>
));

  return (
    <div>
      <table className="min-w-full">
        <tbody>
          {avaliacoesTable}
        </tbody>
      </table>
    </div>
  );
}

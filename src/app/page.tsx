'use client'
import { CardJogo } from "@/components/CardJogo";
import { InputPesquisa } from "@/components/InputPesquisa";
import { JogoItf } from "@/utils/types/JogoItf";
import { useEffect, useState } from "react";
import { useUsuarioStore } from "@/context/UsuarioContext";

export default function Home() {
  const [jogos, setJogos] = useState<JogoItf[]>([])
  const { logaUsuario } = useUsuarioStore()

  useEffect(() => {
    async function buscaDados() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/jogos`)
      const dados = await response.json()
      console.log(dados)
      setJogos(dados)
    }
    buscaDados()

        async function buscaUsuario(id: string) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/usuarios/${id}`)
      const dados = await response.json()
      logaUsuario(dados)
    }
    if (localStorage.getItem("usuarioKey")) {
      const idUsuario = localStorage.getItem("usuarioKey")
      buscaUsuario(idUsuario as string)
    }
  }, [])

  const listaJogos = jogos.map(jogo => (
    <CardJogo data={jogo} key={jogo.id} />
  ))

  return (
    <>
      <InputPesquisa setJogos={setJogos} />
      <div className="bg-black max-w-7xl mx-auto">
        <h1 className="mb-4 text-center text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white font-[Orbitron] underline underline-offset-4 decoration-8 decoration-orange-400 dark:decoration-red-600">
          Jogos em destaque
        </h1>

        <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {listaJogos}
        </div>
      </div>
    </>
  );
}

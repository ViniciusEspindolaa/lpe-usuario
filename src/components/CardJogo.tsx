import type { JogoItf } from "@/utils/types/JogoItf"
import Link from "next/link"
import { Building2, FileText, Users, Gamepad2 } from "lucide-react"

export function CardJogo({ data }: { data: JogoItf }) {
  // Função para truncar a descrição
  const truncateDescription = (text: string, maxLength = 100) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }

  return (
    <div className="h-full max-w-sm bg-zinc-900 border border-red-900 rounded-lg shadow-sm hover:shadow-red-900/20 hover:shadow-lg transition-all duration-300 dark:bg-black dark:border-red-800">
      <div className="relative">
        <img className="rounded-t-lg w-300 h-auto" src={data.foto || "/placeholder.svg"} alt={data.nome} />
        <span className="absolute bottom-2 right-2 bg-red-800 text-white text-xs font-semibold px-2.5 py-1 rounded shadow-md dark:bg-red-900 border border-white">
          {data.genero.nome}
        </span>
      </div>
      <div className="p-5 ">
        <div className="mb-4 pb-3 border-b border-red-900/30 ">
          <h5 className="text-xl font-bold tracking-tight text-white bg-gradient-to-r from-red-500 to-red-800 bg-clip-text dark:from-red-400 dark:to-red-700">
            {data.nome} <span className="text-lg font-medium flex justify-between items-center w-full">({data.ano})</span>
          </h5>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-red-500" />
            <p className="font-light text-zinc-300 dark:text-zinc-400">
              <span className="text-red-400 dark:text-red-500">Desenvolvedora:</span> {data.desenvolvedora}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-red-500" />
            <p className="font-light text-zinc-300 dark:text-zinc-400">
              <span className="text-red-400 dark:text-red-500">Publicadora:</span> {data.publicadora}
            </p>
          </div>
        </div>
        <div className="mb-4 pb-3 border-b border-red-900/30">
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-red-500 mt-1" />
            <p className="font-light text-zinc-300 dark:text-zinc-400">
              <span className="text-red-400 dark:text-red-500">Descrição:</span> {truncateDescription(data.descricao)}
            </p>
          </div>
        </div>

        <Link
          href={`/detalhes/${data.id}`}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-900 dark:bg-red-800 dark:hover:bg-red-700 dark:focus:ring-red-900 w-full justify-center transition-colors"
        >
          Ver Detalhes
          <svg
            className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </Link>
      </div>
    </div>
    )
  }

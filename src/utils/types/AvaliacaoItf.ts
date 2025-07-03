import { JogoItf } from "./JogoItf"

export interface AvaliacaoItf {
  id: number
  clienteId: string
  jogoId: number
  jogo: JogoItf
  descricao: string
  resposta: string | null
  createdAt: string
  updatedAt: string | null
}
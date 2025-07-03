import { JogoItf } from "./JogoItf"

export interface FotoItf {
    id: number
    descricao: string
    jogoId: number
    url: string
    jogo: JogoItf
}
import { GeneroItf } from "./GeneroItf"

export interface JogoItf {
    id: number
    nome: string
    ano: number
    desenvolvedora: string
    publicadora: string
    destaque: boolean
    foto: string
    descricao: string
    createdAt: Date
    updatedAt: Date
    generoId: number
    genero: GeneroItf
    plataforma: string
}
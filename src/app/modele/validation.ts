import { IRole } from "./role"

export interface IValidation {
    id: string,
    code: string,
    etat: boolean,
    role: IRole,
    libelle: string,
    typeVote: string,
    dureeVote: number,
    dateCreation: Date
}
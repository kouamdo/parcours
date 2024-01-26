import { IEtats } from "./etats";

export interface IDocEtats {
    id: string,
    etat : IEtats,
    ordre : number,
    dateCreation: Date
}
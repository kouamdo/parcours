import { IEtats } from "./etats";

export interface IOrdreEtat {
    id: string,
    ordre : number,
    etat : IEtats,
    dateCreation: Date
}

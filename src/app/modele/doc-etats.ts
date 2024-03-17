import { IEtats } from "./etats";
import { IValidation } from "./validation";

export interface IDocEtats {
    id: string,
    etat : IEtats,
    ordre : number,
    dateCreation: Date,
    validation? : IValidation
}
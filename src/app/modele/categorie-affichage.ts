import { IAttributs } from "./attributs";

export interface ICategorieAffichage {
    id:string,
    nom:string,
    ordre : number,
    attribut : IAttributs
}

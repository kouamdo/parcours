import { IAttributs } from "./attributs";

export interface IAssociationCategorieAttributs {
    id?:string,
    ordre: number,
    obligatoire: boolean,
    attribut : IAttributs
}

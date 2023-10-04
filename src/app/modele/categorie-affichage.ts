import { IAssociationCategorieAttributs } from "./association-categorie-attributs";

export interface ICategorieAffichage {
    id:string,
    nom:string,
    ordre : number,
    attributCategories : IAssociationCategorieAttributs
}

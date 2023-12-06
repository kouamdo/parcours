import { IAssociationCategorieAttributs } from "./association-categorie-attributs";

export interface ICategoriesAttributs {
    id:string,
    nom:string,
    ordre : number,
    listAttributsParCategories : IAssociationCategorieAttributs[]
}

import { IAttributs } from "./attributs";
import { ICategoriesAttributs } from "./categories-attributs";
import { IDocument } from "./document";
import { IMission } from "./mission";

export interface IAfficheDocument extends IDocument {
    id:string,
    titre:string,
    description:string,
    missions : IMission[],
    attributs : IAttributs[],
    categories : ICategoriesAttributs[],
    listeMissions : string,
    listAttributs : string,
    listCategories : string,
    listPreconisations : string
}

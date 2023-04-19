import { IAttributs } from "./attributs";
import { ICategoriesAttributs } from "./categories-attributs";
import { IMission } from "./mission";

export interface IDocument {
    id:string,
    titre:string,
    description:string,
    missions : IMission[],
    attributs : IAttributs[],
    categories : ICategoriesAttributs[]
}

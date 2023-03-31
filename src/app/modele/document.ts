import { IAttributs } from "./attributs";
import { IMission } from "./mission";

export interface IDocument {
    id:string,
    titre:string,
    description:string,
    missions : IMission[],
    attributs : IAttributs[]
}

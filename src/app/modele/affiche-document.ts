import { IAttributs } from "./attributs";
import { IMission } from "./mission";

export interface IAfficheDocument {
    id:string,
    titre:string,
    description:string,
    missions : IMission[],
    attributs : IAttributs[],
    listeMissions : string,
    listAttributs : string
}

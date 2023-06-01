import { IFamille } from "./famille";

export interface IRessource {
    id:string,
    libelle:string,
    etat:boolean,
    quantite:number,
    prix:number,
    unite:string,
    //dateCreation:Date,
   // dateModification:Date,
    famille:IFamille,
}

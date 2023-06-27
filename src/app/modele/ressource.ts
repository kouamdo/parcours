import { IFamille } from "./famille";
import { Unites } from "./unites";


export interface IRessource {
    id:string,
    libelle:string,
    etat:boolean,
    quantite:number,
    prix:number,
    unite:Unites,
    famille:IFamille,

   /* dateCreation:Date,
    dateModification:Date,*/

}

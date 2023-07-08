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
    caracteristique:string,
   /* dateCreation:Date,
    dateModification:Date,*/

}

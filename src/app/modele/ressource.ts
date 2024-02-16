import { ModalCodebarreService } from "../modules/shared/modal-codebarre/modal-codebarre.service";
import { IFamille } from "./famille";


export interface IRessource {
    id:string,
    libelle:string,
    etat:boolean,
    quantite:number,
    prixEntree:number,
    prixDeSortie:number,
    unite:string,
    famille:IFamille,
    caracteristique:string,
    scanBarCode?: any,
   /* dateCreation:Date,
    dateModification:Date,*/
}

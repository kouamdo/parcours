//import { TypeMvt } from "./type-mvt";
import { IRessource } from "./ressource";
import { IFamille } from "./famille";
import { IDistributeur } from "./distributeur";


export interface IPrecoMvtQte {
  id:string,
  quantiteMin:number,
  quantiteMax:number,
  montantMin:number,
  montantMax:number,
  //fournisseur:string,
  distributeur?:IDistributeur[],
  ressource?:IRessource,
  famille?:IFamille[],
}

import { TypeMvt } from "./type-mvt";
import { IRessource } from "./ressource";
import { IFamille } from "./famille";


export interface IPrecoMvtQte {
  id:string,
  quantiteMin:number,
  quantiteMax:number,
  montantMin:number,
  montantMax:number,
  fournisseur:string,
  ressource?:IRessource,
  famille?:IFamille[],
}

import { TypeMvt } from "./type-mvt";
import { IRessource } from "./ressource";
import { IFamille } from "./famille";


export interface IPrecomvtqte {
  id:string,
  libelle:string,
  quantiteMin:number,
  quantiteMax:number,
  montantMin:number,
  montantMax:number,
  type:TypeMvt,
  ressource:IRessource,
  famille:IFamille[],
}

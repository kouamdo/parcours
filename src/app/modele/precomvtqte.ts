import { TypeMvt } from "./type-mvt";

export interface IPrecomvtqte {
  id:string,
  libelle:string,
  quantiteMin:number,
  quantiteMax:number,
  montantMin:number,
  montantMax:number,
  type:TypeMvt,
}

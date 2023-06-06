import { TypeMvt } from "./type-mvt";

export interface IPrecoMvtQte {
  id:string,
  quantiteMin:number,
  quantiteMax:number,
  montantMin:number,
  montantMax:number,
  types:TypeMvt,
}

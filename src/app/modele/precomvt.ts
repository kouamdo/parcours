import { TypeMvt } from "./type-mvt";

export interface IPrecomvt {
  id:string,
  libelle:string,
  etat:boolean,
  //dateCreation:Date,
  //dateModification:Date,
  type:TypeMvt,
  quantiteMin:number,
  quantiteMax:number,
  montantMin:number,
  montantMax:number,
}

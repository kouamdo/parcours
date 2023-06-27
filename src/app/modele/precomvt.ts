import { TypeMvt } from "./type-mvt";
import { IPrecomvtqte } from "./precomvtqte";



export interface IPrecomvt {
  id:string,
  libelle:string,
  etat:boolean,
  /*dateCreation:Date,
  dateModification:Date,*/
  type:TypeMvt,
  precomvtqte:IPrecomvtqte[],

}

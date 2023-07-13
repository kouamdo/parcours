import { TypeMvt } from "./type-mvt";
import { IPrecoMvtQte } from "./precomvtqte";



export interface IPrecoMvt {
  id:string,
  libelle:string,
  etat:boolean,
  /*dateCreation:Date,
  dateModification:Date,*/
  type:TypeMvt,
  precomvtqte:IPrecoMvtQte[],

}

//import { TypeMvt } from "./type-mvt";
import { IPrecoMvtQte } from "./precomvtqte";



export interface IPrecoMvt {
  id:string,
  libelle:string,
  /*dateCreation:Date,
  dateModification:Date,*/
  //type:TypeMvt,
  type:string,
  precomvtqte:IPrecoMvtQte[],

}

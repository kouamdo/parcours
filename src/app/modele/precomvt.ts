import { IPrecoMvtQte } from "./precomvtqte";

export interface IPrecoMvt {
  id:string,
  libelle:string,
  etat:boolean,
  type:string,
  precomvtqte:IPrecoMvtQte[]
}

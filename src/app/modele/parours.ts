import { IEtape } from "./etape";

export interface IParours {
  id:string,
  libelle:string,
  dateCreation?:Date,
  etape:IEtape[]
}

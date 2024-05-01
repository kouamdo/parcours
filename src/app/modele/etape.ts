import { IDocument } from "./document";


export interface IEtape {
  id:string,
  libelle:string,
  etat:boolean,
  document: IDocument[],
}

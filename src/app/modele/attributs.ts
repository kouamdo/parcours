import { TypeTicket } from "./type-ticket";

export interface IAttributs {
    id:string,
    titre:string,
    description:string,
    etat:boolean,
    dateCreation?:Date,
    dateModification?:Date,
    valeursParDefaut: string,
    type:TypeTicket
}

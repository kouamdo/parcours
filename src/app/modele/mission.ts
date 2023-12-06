import { IService } from "./service"

export interface IMission {
    id:string,
    libelle:string,
    description:string,
    etat:boolean,
    dateCreation:Date,
    dateModification:Date,
    service:IService,
    idLogin?:string 
}

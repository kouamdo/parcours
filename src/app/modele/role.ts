import { IMission } from "./mission"
import { IValidation } from "./validation"

export interface IRole {
  id:string,
  titre:string,
  description:string,
  etat:boolean,
  dateCreation?:Date,
  validations?: IValidation[],
  missions?: [{
    mission:IMission,
    etat: boolean,
    dateDebut:Date,
    dateFin?:Date,
    droitDajouter: boolean,
    droitModifier: boolean,
    droitDevalider: boolean,
    droitConsulter: boolean
}]
}

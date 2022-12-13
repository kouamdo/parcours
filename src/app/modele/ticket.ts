import { IPatient } from "./Patient";
import { IService } from "./service";

export interface ITicket {
    id:string;
    idUnique:string;
    date_heure:Date;
    idFileAttente:string;
    idPersonne:string;
}

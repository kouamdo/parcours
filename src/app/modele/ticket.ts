import { IPatient } from "./Patient";
import { IService } from "./service";

export interface Ticket {
    id:Number;
    dateImpression:Date;
    patient:IPatient;
    service:IService;
}

import { IPatient } from "./Patient";
import { IPersonnel } from "./personnel";

export interface IComptes {
    id: string,
    solde: number,
    libelle: string,
    montantDecouvertMax?: number,
    dateCreation: Date,
    beneficiaire?: IPatient
}
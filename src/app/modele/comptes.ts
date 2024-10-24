import { IPatient } from "./Patient";

export interface IComptes {
    id: string,
    solde: number,
    libelle: string,
    dateCreation: Date,
    beneficiaire?: IPatient,
    montantDecouvertMax?: number
}
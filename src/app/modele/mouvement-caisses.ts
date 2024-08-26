import { float } from "@zxing/library/esm/customTypings";
import { ICaisses } from "./caisses";
import { IComptes } from "./comptes";
import { IPersonnel } from "./personnel";
import { IExemplaireDocument } from "./exemplaire-document";
import { IPatient } from "./Patient";

export interface IMouvementCaisses {
    id: string,
    etat: boolean,
    montant: float,
    libelle: string,
    typeMvt: string,
    dateCreation: Date,
    detailJson?: string,
    moyenPaiement: string,
    referencePaiement: string,
    caisse?: ICaisses,
    compte?: IComptes,
    personnel: IPatient,
    exemplaire: IExemplaireDocument
}
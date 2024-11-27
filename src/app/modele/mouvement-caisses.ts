import { float } from "@zxing/library/esm/customTypings";
import { ICaisses } from "./caisses";
import { IComptes } from "./comptes";
import { IExemplaireDocument } from "./exemplaire-document";
import { IPatient } from "./Patient";

export interface IMouvementCaisses {
    id: string,
    etat: boolean,
    montant: float,
    libelle: string,
    typeMvt: string,
    dateCreation: Date,
    detailJson?: Monaies,
    moyenPaiement: ICaisses,
    isMultipaiement?: string,
    referencePaiement: string,
    compte?: IComptes,
    personnel: IPatient,
    exemplaire: IExemplaireDocument
}

export interface MoyenPaiement {
    moyen: ICaisses,
    montant: float,
    reference: string
}

export interface Monaies {
    pieces?: {
        x1?: number,
        x2?: number,
        x5?: number,
        x10?: number,
        x25?: number,
        x50?: number,
        x100?: number,
        x500?: number,
    },
    billets?: {
        x500?: number,
        x1000?: number,
        x2000?: number,
        x5000?: number,
        x10000?: number,
    }
}
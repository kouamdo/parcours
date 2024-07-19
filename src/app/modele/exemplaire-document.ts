import { IPatient } from "./Patient";
import { IDocument } from "./document";
import { IMouvement } from "./mouvement";
import { ObjetCleValeur } from "./objet-cle-valeur";
import { IOrdreEtat } from "./ordreEtat";

export interface IExemplaireDocument extends IDocument{
    id : string,
    code : string
    idDocument : string,
    ordreEtats?: IOrdreEtat[],
    mouvements?: IMouvement[],
    objetEnregistre : ObjetCleValeur[],
    idSousExelplaires? : string[]
    dateCreation : Date
    personneRattachee : IPatient
}

import { IPatient } from "./Patient";
import { IDocument } from "./document";
import { IMouvement } from "./mouvement";
import { ObjetCleValeur } from "./objet-cle-valeur";

export interface IExemplaireDocument extends IDocument{
    id : string,
    idDocument : string,
    mouvements?: IMouvement[]
    objetEnregistre : ObjetCleValeur[]
    idSousExelplaires? : string[]
    dateCreation : Date
    personneRattachee : IPatient
}

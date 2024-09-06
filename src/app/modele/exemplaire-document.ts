import { IPatient } from "./Patient";
import { IDistributeur } from "./distributeur";
import { IDocument } from "./document";
import { IMouvement } from "./mouvement";
import { ObjetCleValeur } from "./objet-cle-valeur";
import { IOrdreEtat } from "./ordreEtat";
import { IPromo } from "./promo-distributeur";

export interface IExemplaireDocument extends IDocument{
    id : string,
    code : string
    idDocument : string,
    ordreEtats?: IOrdreEtat[],
    mouvements?: IMouvement[],
    objetEnregistre : ObjetCleValeur[],
    idSousExelplaires? : string[]
    dateCreation : Date
    personneRattachee? : IPatient
    assurance? : IDistributeur
    promotion? : IPromo
}

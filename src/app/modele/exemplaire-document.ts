import { IDocument } from "./document";
import { ObjetCleValeur } from "./objet-cle-valeur";

export interface IExemplaireDocument{
    id : string
    idDocument : string
    objetEnregistre : ObjetCleValeur[]
}

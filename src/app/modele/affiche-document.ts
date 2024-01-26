import { IAttributs } from "./attributs";
import { ICategoriesAttributs } from "./categories-attributs";
import { IDocument } from "./document";
import { IMission } from "./mission";
import { IPrecoMvt } from "./precomvt";

export interface IAfficheDocument extends IDocument {
    listeMissions : string,
    listAttributs : string,
    listCategories : string,
    listPreconisations : string
    listSousDocuments : string
    listDocEtats : string
}

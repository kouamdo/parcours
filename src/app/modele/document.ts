import { IAttributs } from "./attributs";
import { ICategoriesAttributs } from "./categories-attributs";
import { IDocEtats } from "./doc-etats";
import { IMission } from "./mission";
import { IPrecoMvt } from "./precomvt";

export interface IDocument {
    id:string,
    titre:string,
    description:string,
    etat:boolean,
    typeMouvement: String,
    affichagePrix:boolean,
    contientRessources:boolean,
    contientDistributeurs:boolean,
    missions : IMission[],
    attributs : IAttributs[],
    categories : ICategoriesAttributs[]
    preconisations : IPrecoMvt[]
    sousDocuments? : IDocument[]
    docEtats : IDocEtats[]
}

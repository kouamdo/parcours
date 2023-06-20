export interface IService {
    id:string,
    libelle:string,
    etat?:string,
    dateDerniereModification?: Date,
    dateAttribution?: Date,
    dateFin: Date,
    nombreTotalAttributions:number
}

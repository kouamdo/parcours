export interface IEtats {
    id: string,
    libelle : string,
    description : string,
    dateCreation: Date
    etatPrecedant?: IEtats[]
    etatSuivant?: IEtats[]
}

export interface ITicket {
    id:string;
    idUnique:string;
    date_heure:Date;
    idFileAttente:string | null;
    idPersonne:string | null;
    statut:string;
}

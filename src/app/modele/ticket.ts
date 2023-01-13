export interface ITicket {
    id:number;
    idUnique:string;
    date_heure:Date;
    idFileAttente:string | null;
    idPersonne:string | null;
    statut:string;
}

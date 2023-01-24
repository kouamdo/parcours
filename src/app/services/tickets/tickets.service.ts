import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of, filter, EMPTY } from 'rxjs';
import { ITicket } from 'src/app/modele/ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  
  constructor(private http:HttpClient) { }

  getAllTickets():Observable<ITicket[]>
  {
    return this.http.get<ITicket[]>('api/tickets').pipe();
  }

  getTicketById(id:number):Observable<ITicket>{
    return this.getAllTickets().pipe(
      map(x=>
        {
          return x.find(p=>p.id==id) as ITicket
        })
    );
  }

  /*updateTicket(id: string, params: ITicket) {
    return this.http.put(`${"api/tickets"}/${id}`, params);
  }*/
  getAllTicketsActifs():Observable<ITicket[]>{
    
    return this.getAllTickets().pipe(
      map(x=>
        {
          return x.filter(p=>p.statut == "Actif")
        })
    );    
  }
  
  getNextTicketActif():Observable<ITicket[]>{
   /* let listTicketsActifs : ITicket[] | undefined;
    this.getAllTicketsActifs().pipe(val => listTicketsActifs=val
    );   
     return of(this.getMinDate(listTicketsActifs));*/
     return this.getAllTicketsActifs();
  }
  getMinDate(listTicketsActifs : ITicket[] | undefined): ITicket{
    if(listTicketsActifs == undefined){
        let retour : ITicket ={
            id:-1,
            idUnique:"",
            date_heure: new Date,
            idFileAttente:  null,
            idPersonne: null,
            statut:"0"
        };
        return retour;
    }
    else{
     let minDate :Date = listTicketsActifs[0].date_heure;
     let indexChercher = 0;
      for (let index = 1; index < listTicketsActifs.length; index++) {
        if (listTicketsActifs[index].date_heure.getTime() < minDate.getTime()) {
          minDate = listTicketsActifs[index].date_heure;
          indexChercher = index;
        }
      }
      return listTicketsActifs[indexChercher];
    }
    
  }

  modifierTicket(ticket:ITicket)
  {
    return this.http.post("api/tickets",ticket);
  }
  attribuerTicket(id_patient : string | null, id_service : string | null):Observable<ITicket>
  {
    let ticket : ITicket = {
      id: Number(9),
      idUnique: '123456',
      date_heure: new Date,
      idFileAttente: id_service,
      idPersonne: id_patient,
      statut: 'actif'
    };

    this.http.post("api/tickets",ticket);

    return of(ticket);
  }
  
  modifierOuNouveauTicket(ticketRecent: ITicket):Observable < ITicket>
  {
    console.log("resultat " + ticketRecent)
    this.http.post("api/tickets",ticketRecent);
    let ticket : ITicket = {
      id: 23,
      idUnique: '123456',
      date_heure: new Date,
      idFileAttente: "ABC",
      idPersonne: "1",
      statut: 'Actif'
    };

    ticketRecent = ticket

    return of (ticketRecent);
  }
  
}

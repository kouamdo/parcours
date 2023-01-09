import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { ITicket } from 'src/app/modele/ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  
  constructor(private http:HttpClient) { }

  getAllTickets():Observable<ITicket[]>
  {
    return this.http.get<ITicket[]>('api/tickets').pipe(map(x=>x));
  }
  getTicketById(id:number):Observable<ITicket>{
    return this.getAllTickets().pipe(
      map(x=>
        {
          return x.find(p=>p.id==id) as ITicket
        })
    );
  }

  ajouterTicket(ticket:ITicket)
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
      idPersonne: id_patient
    };

    this.http.post("api/tickets",ticket);

    return of(ticket);
  }
}

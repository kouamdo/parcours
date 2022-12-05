import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
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
}

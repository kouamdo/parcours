import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, EMPTY } from 'rxjs';
import { ITicket } from 'src/app/modele/ticket';
import { TicketsService } from 'src/app/services/tickets/tickets.service';

@Component({
  selector: 'app-list-tickets',
  templateUrl: './list-tickets.component.html',
  styleUrls: ['./list-tickets.component.scss']
})
export class ListTicketsComponent implements OnInit {

  tickets$:Observable<ITicket[]>=EMPTY;

  constructor(private translate: TranslateService, private router:Router, private serviceTicket:TicketsService) { }

  ngOnInit(): void {
    this.tickets$ = this.getAllTickets();
  }

  private getAllTickets(){
    return this.serviceTicket.getAllTickets();
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, EMPTY } from 'rxjs';
import { IPatient } from 'src/app/modele/Patient';
import { ITicket } from 'src/app/modele/ticket';
import { PatientsService } from 'src/app/services/patients/patients.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';

@Component({
  selector: 'app-ticket-courant',
  templateUrl: './ticket-courant.component.html',
  styleUrls: ['./ticket-courant.component.scss']
})
export class TicketCourantComponent implements OnInit {

  tickets$:Observable<ITicket[]>=EMPTY;
  patients$:Observable<IPatient[]>=EMPTY;

  constructor(private translate: TranslateService, private router:Router, private serviceTicket:TicketsService, private servicePatient:PatientsService) { }

  ngOnInit(): void {
    this.tickets$ = this.getAllTickets();
    this.patients$ = this.getAllPatients();
  }

  private getAllTickets(){
    return this.serviceTicket.getAllTickets();
  }
  private getAllPatients(){
    return this.servicePatient.getAllPatients();
  }
}

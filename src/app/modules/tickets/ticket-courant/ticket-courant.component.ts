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
  minDate : Date = new Date()

  constructor(private translate: TranslateService, private router:Router, private serviceTicket:TicketsService, private servicePatient:PatientsService) { 
    
  }

  ngOnInit(): void {
    this.tickets$ = this.getAllTicketsActifsSort();
    this.patients$ = this.getAllPatients();
    
    this.tickets$.subscribe(
      x=>{
        let minDate = x[0].date_heure
        this.minDate = minDate
    console.log("la date la plus anciene du tableau est " + this.serviceTicket.getMinDate(this.minDate))
      }
    )
  }

  private getAllTicketsActifsSort(){
    console.log("la date est " + this.minDate)
    return this.serviceTicket.getAllTicketsActifsSort(this.serviceTicket.getMinDate(this.minDate));
  }
  private getAllPatients(){
    return this.servicePatient.getAllPatients();
  }
}

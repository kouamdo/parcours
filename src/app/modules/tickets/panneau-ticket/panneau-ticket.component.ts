import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, EMPTY } from 'rxjs';
import { IPatient } from 'src/app/modele/Patient';
import { ITicket } from 'src/app/modele/ticket';
import { CodeBarreContinuService } from 'src/app/services/code-barre-continu/code-barre-continu.service';
import { PatientsService } from 'src/app/services/patients/patients.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';

@Component({
  selector: 'app-panneau-ticket',
  templateUrl: './panneau-ticket.component.html',
  styleUrls: ['./panneau-ticket.component.scss']
})
export class PanneauTicketComponent implements OnInit {
  tickets$:Observable<ITicket[]>=EMPTY;
  ticketRecent:ITicket | undefined;
  patientRecent:IPatient | undefined;


  showScanner = false;
  scanResult = '';
  scanHistory: string[] = [];
  
  constructor(private translate: TranslateService, private router:Router, private serviceTicket:TicketsService, private servicePatient:PatientsService,  private http:HttpClient,
    private barcodeScannerService: CodeBarreContinuService
  ) { 
    this.barcodeScannerService.scanResult$.subscribe(result => {
      this.scanResult = result;
      this.scanHistory.push(result); // Ajoute chaque résultat aux scans précédents
    });
  }

  ngOnInit(): void {
    this.tickets$ = this.getAllTicketsAttente();
  }

  private getAllTicketsAttente(){
    return this.serviceTicket.getAllTicketsAttente();
  }


  toggleScanner() {
    this.showScanner = !this.showScanner;
  }

  closeScanner() {
    this.showScanner = false; // Ferme le scanner
  }
}

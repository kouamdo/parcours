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

  ticketRecent:ITicket | undefined;
  patientRecent:IPatient | undefined;
  minDate : Date = new Date();

  constructor(private translate: TranslateService, private router:Router, private serviceTicket:TicketsService, private servicePatient:PatientsService) { 
   
  }

  ngOnInit(): void {
    this.afficherSuivant();
  }

  afficherSuivant(){
    //TODO ajouter en parametre l'id du personnel connecté afin de filtrer les tickets actifs de son service
    //lorsqu'on renverra un ticket n fois, le back pourra le mettre dans un état annulé 
    this.serviceTicket.getNextTicketActif().subscribe(valeur => {
      this.ticketRecent = this.getMinDate(valeur);

      if(this.ticketRecent?.idPersonne){
        this.servicePatient.getPatientById(this.ticketRecent?.idPersonne).subscribe(
          valeur =>{this.patientRecent= valeur;} 
        );
      }
            
    });
  }
  faire(){
    alert(this.patientRecent?.nom);
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
        if (listTicketsActifs[index].date_heure < minDate) {
          minDate = listTicketsActifs[index].date_heure;
          indexChercher = index;
        }
      }

      return listTicketsActifs[indexChercher];
    }
  }
}

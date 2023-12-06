import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, EMPTY, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IPatient } from 'src/app/modele/Patient';
import { ITicket } from 'src/app/modele/ticket';
import { PatientsService } from 'src/app/services/patients/patients.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { StatutTicket } from 'src/app/modele/statut-ticket';

@Component({
  selector: 'app-ticket-courant',
  templateUrl: './ticket-courant.component.html',
  styleUrls: ['./ticket-courant.component.scss']
})
export class TicketCourantComponent implements OnInit {

  ticketRecent:ITicket | undefined;
  patientRecent:IPatient | undefined;
  minDate : Date = new Date();
  statutTicketActif = StatutTicket.actif
  statutTicketAttente = StatutTicket.attente
  statutTicketTraite = StatutTicket.traite

  constructor(private translate: TranslateService, private router:Router, private serviceTicket:TicketsService, private servicePatient:PatientsService, private http:HttpClient) { 
   
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
          valeur =>{this.patientRecent= valeur;
            this.sauvegardeIdentitePatient();  
          } 
        );
      }
            
    });
  }
  ticketTraite(){
      this.ticketRecent!.statut = this.statutTicketTraite
      this.serviceTicket.modifierTicket(this.ticketRecent!).subscribe()
      this.afficherSuivant()
  }
  ticketRenvoye(){
      this.afficherSuivant()
      this.ticketRecent!.statut = this.statutTicketActif
      this.serviceTicket.modifierTicket(this.ticketRecent!).subscribe()
  }
  ticketAttente(){
    if (this.ticketRecent!.statut == this.statutTicketActif) {
      this.ticketRecent!.statut = this.statutTicketAttente
      this.serviceTicket.modifierTicket(this.ticketRecent!).subscribe()
      
    }else if(this.ticketRecent!.statut == this.statutTicketAttente){

      this.serviceTicket.modifierOuNouveauTicket(this.ticketRecent!).subscribe(
        objet=>{
          this.ticketRecent = objet;
          if(this.ticketRecent?.idPersonne){
            this.servicePatient.getPatientById(this.ticketRecent?.idPersonne).subscribe(
              valeur =>{this.patientRecent= valeur;
                this.sauvegardeIdentitePatient();              
              } 
            );
          }
        }
      )
    }
    else{
      //relanceAppel vers IHM affichage des tickets
    }
  }
  getMinDate(listTicketsActifs : ITicket[] | undefined): ITicket{
    if(listTicketsActifs == undefined){
        let retour : ITicket ={
            id:"-1",
            idUnique:"",
            date_heure: new Date,
            idFileAttente:  null,
            idPersonne: null,
            statut: this.statutTicketActif
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

  sauvegardeIdentitePatient(){
    if(this.patientRecent){
      sessionStorage.setItem("idPatientCourant",this.patientRecent.id);
      let nomPersonne = this.patientRecent.nom.concat(" ");
      if(this.patientRecent.prenom)
        nomPersonne = nomPersonne.concat(this.patientRecent.prenom);
      sessionStorage.setItem("nomPatientCourant", nomPersonne);
    }
  }
}

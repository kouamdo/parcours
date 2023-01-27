import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, Observable } from 'rxjs';
import { IPatient } from 'src/app/modele/Patient';
import { IService } from 'src/app/modele/service';
import { ITicket } from 'src/app/modele/ticket';
import { PatientsService } from 'src/app/services/patients/patients.service';
import { ServicesService } from 'src/app/services/services/services.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';

@Component({
  selector: 'app-list-patients',
  templateUrl: './list-patients.component.html',
  styleUrls: ['./list-patients.component.scss']
})
export class ListPatientsComponent implements OnInit {

  patients$:Observable<IPatient[]>=EMPTY;

  services$:Observable<IService[]>=EMPTY;

  tickets$:Observable<ITicket[]>=EMPTY;

  id_personne : string = "0";
  id_service : number = 0;
  nom_patient : string = "";
  libelle_service : string = "";
  currentDate : Date = new Date()

  constructor(private translate: TranslateService,private router:Router, private servicePatient:PatientsService, private serviceService:ServicesService, private serviceTicket:TicketsService) { }

  ngOnInit(): void {
    this.patients$ = this.getAllPatients();
    this.services$ = this.getAllServices();
    this.tickets$ = this.getAllTickets();
  }

  setIdPersonne(id_personne : string, nom_patient : string){
    this.id_personne = id_personne;
    this.nom_patient = nom_patient
    sessionStorage.setItem("id_patient", this.id_personne.toString());
    sessionStorage.setItem("nom_patient", this.nom_patient);
  }
  setLibelleService(id_service : number, libelleService: string){
    this.libelle_service = libelleService;
    this.id_service = id_service;

    sessionStorage.setItem("id_service", this.id_service.toString());
    sessionStorage.setItem("libelle_service", this.libelle_service);
  }

  private getAllPatients(){
    return this.servicePatient.getAllPatients();
  }
  private getAllServices(){
    return this.serviceService.getAllServices();
  }
  private getAllTickets(){
    return this.serviceTicket.getAllTickets();
  }
}

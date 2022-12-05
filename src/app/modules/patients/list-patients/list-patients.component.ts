import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, Observable } from 'rxjs';
import { IPatient } from 'src/app/modele/Patient';
import { IService } from 'src/app/modele/service';
import { ITicket } from 'src/app/modele/ticket';
import { PatientsService } from 'src/app/services/patients/patients.service';
import { ServicesService } from 'src/app/services/services/services.service';

@Component({
  selector: 'app-list-patients',
  templateUrl: './list-patients.component.html',
  styleUrls: ['./list-patients.component.scss']
})
export class ListPatientsComponent implements OnInit {

  patients$:Observable<IPatient[]>=EMPTY;

  services$:Observable<IService[]>=EMPTY;

  tickets$:Observable<ITicket[]>=EMPTY;

  iTicket : ITicket = {
    id: 2,
    dateImpression: new Date
  };
  libelle : string = "";

  //titre:string="Patients retrouvé(e)s";

  constructor(private translate: TranslateService,private router:Router, private servicePatient:PatientsService, private serviceService:ServicesService) { }

  ngOnInit(): void {
    this.patients$ = this.getAllPatients();
    this.services$ = this.getAllServices();
    sessionStorage.getItem(this.libelle)
    sessionStorage.setItem("le libelle est", this.libelle)
  }

  private getAllPatients(){
    return this.servicePatient.getAllPatients();
  }
  private getAllServices(){
    return this.serviceService.getAllServices();
  }
}

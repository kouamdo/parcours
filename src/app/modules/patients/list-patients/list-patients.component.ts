import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, Observable } from 'rxjs';
import { IPatient } from 'src/app/modele/Patient';
import { PatientsService } from 'src/app/services/patients/patients.service';

@Component({
  selector: 'app-list-patients',
  templateUrl: './list-patients.component.html',
  styleUrls: ['./list-patients.component.scss']
})
export class ListPatientsComponent implements OnInit {

  patients$:Observable<IPatient[]>=EMPTY;

  //titre:string="Patients retrouvé(e)s";

  constructor(private translate: TranslateService,private router:Router, private servicePatient:PatientsService) { }

  ngOnInit(): void {
    this.patients$ = this.getAllPatients();
  }

  private getAllPatients(){
    return this.servicePatient.getAllPatients();
  }

}

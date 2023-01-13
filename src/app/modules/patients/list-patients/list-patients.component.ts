import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, Observable } from 'rxjs';
import { IPatient } from 'src/app/modele/Patient';
import { PatientsService } from 'src/app/services/patients/patients.service';
import {FormControl} from '@angular/forms';

export interface User {
  nom: string;
}

@Component({
  selector: 'app-list-patients',
  templateUrl: './list-patients.component.html',
  styleUrls: ['./list-patients.component.scss']
})
export class ListPatientsComponent implements OnInit {

  patients$:Observable<IPatient[]>=EMPTY;

  myControl = new FormControl<string | IPatient>('');
  options: IPatient[] = [];
  filteredOptions: IPatient[] | undefined;
  constructor(private translate: TranslateService,private router:Router, private servicePatient:PatientsService) { }

  ngOnInit(): void {
    this.patients$ = this.getAllPatients();
    this.myControl.valueChanges.subscribe(
      value => {
        const name = typeof value === 'string' ? value : value?.nom;
        if(name != undefined && name?.length >0){
          this.servicePatient.getPatientsByName(name.toLowerCase() as string).subscribe(
            reponse => { 
              this.filteredOptions = reponse;
            }
          )
        }
        else{
          this.filteredOptions = [];
        }
        
      }
    );
  }

  private getAllPatients(){
    return this.servicePatient.getAllPatients();
  }

  displayFn(user: IPatient): string {
    return user && user.nom ? user.nom : '';
  }


  public rechercherListingPersonne(option: IPatient){
    this.patients$ = this.servicePatient.getPatientsByName(option.nom.toLowerCase());
  }

}

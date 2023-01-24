import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, Observable } from 'rxjs';
import { IPatient } from 'src/app/modele/Patient';
import { PatientsService } from 'src/app/services/patients/patients.service';
import {FormControl} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

export interface User {
  nom: string;
}

@Component({
  selector: 'app-list-patients',
  templateUrl: './list-patients.component.html',
  styleUrls: ['./list-patients.component.scss']
})
export class ListPatientsComponent implements OnInit, AfterViewInit {

  patients$:Observable<IPatient[]>=EMPTY;

  myControl = new FormControl<string | IPatient>('');
 
  ELEMENTS_TABLE: IPatient[] = [];
  filteredOptions: IPatient[] | undefined;

  displayedColumns: string[] = ['nom', 'prenom', 'anniversaire', 'sexe', 'mail', 'adresse', 'telephone', 'actions'];
  
  dataSource = new MatTableDataSource<IPatient>(this.ELEMENTS_TABLE);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(private translate: TranslateService,private router:Router, private servicePatient:PatientsService) { 

  }

  ngOnInit(): void {
    this.patients$ = this.getAllPatients();
    
    this.getAllPatients().subscribe(valeurs => {
      this.dataSource.data = valeurs;
    });

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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  public rechercherListingPersonne(option: IPatient){
    this.patients$ = this.servicePatient.getPatientsByName(option.nom.toLowerCase());
  }

}

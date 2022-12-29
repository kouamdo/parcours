import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, Observable } from 'rxjs';
import { IPatient } from 'src/app/modele/Patient';
import { PatientsService } from 'src/app/services/patients/patients.service';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';

export interface User {
  name: string;
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
  filteredOptions: Observable<IPatient[]> | undefined;

  constructor(private translate: TranslateService,private router:Router, private servicePatient:PatientsService) { }

  ngOnInit(): void {
    this.patients$ = this.getAllPatients();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.nom;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }

  private getAllPatients(){
    return this.servicePatient.getAllPatients();
  }

  displayFn(user: IPatient): string {
    return user && user.nom ? user.nom : '';
  }

  private _filter(name: string): IPatient[] {
    const filterValue = name.toLowerCase();
    this.servicePatient.getPatientsByName(filterValue).subscribe(
      pers => this.options=pers
    );
    return this.options;
  }

}

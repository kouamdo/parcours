import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, Observable } from 'rxjs';
import { IValidation } from 'src/app/modele/validation';
import { ValidationsService } from 'src/app/services/validations/validations.service';

@Component({
  selector: 'app-list-validations',
  templateUrl: './list-validations.component.html',
  styleUrls: ['./list-validations.component.scss']
})
export class ListValidationsComponent implements OnInit {


  validations$:Observable<IValidation[]>=EMPTY;

  id_validation : string = "0";
  code : string = "";


  myControl = new FormControl<string | IValidation>('');

  ELEMENTS_TABLE: IValidation[] = [];
  filteredOptions: IValidation[] | undefined;

  displayedColumns: string[] = ['code', 'libelle', 'type', 'durée', 'role', 'etat', 'date', 'actions'];

  dataSource = new MatTableDataSource<IValidation>(this.ELEMENTS_TABLE);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  constructor(private translate: TranslateService,private router:Router, private serviceValidation:ValidationsService, private _liveAnnouncer: LiveAnnouncer, public datePipe: DatePipe){ }

  ngOnInit(): void {
    this.getAllValidations().subscribe(valeurs => {
      this.dataSource.data = valeurs;
    });

    this.myControl.valueChanges.subscribe(
      value => {
        const name = typeof value === 'string' ? value : value?.code;
        if(name != undefined && name?.length >0){
          this.serviceValidation.getValidationByCode(name.toLowerCase() as string).subscribe(
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


  /* setIdValidation (id_validation: string, code_validation : string){
    this.id_validation = id_validation;
    this.code = code_validation
    sessionStorage.setItem("id_role", this.id_role.toString());
    sessionStorage.setItem("titre_role", this.titre_role);
  }
  setraisonSocialService(id_service : number, raisonSocialService: string){
    this.titre_service = raisonSocialService;
    this.id_service = id_service;

    sessionStorage.setItem("id_service", this.id_service.toString());
    sessionStorage.setItem("raisonSocial_service", this.titre_service);
  } */

  private getAllValidations(){
    return this.serviceValidation.getAllValidations();
  }

  displayFn(user: IValidation): string {
    return user && user.code ? user.code: '';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public rechercherListingValidation(option: IValidation){
    this.serviceValidation.getValidationByCode(option.code.toLowerCase()).subscribe(
        valeurs => {this.dataSource.data = valeurs;}
    )
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

}

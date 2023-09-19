import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IPersonnel } from 'src/app/modele/personnel';
import { PersonnelsService } from 'src/app/services/personnels/personnels.service';

export interface User {
  nom: string;
}

@Component({
  selector: 'app-list-personnels',
  templateUrl: './list-personnels.component.html',
  styleUrls: ['./list-personnels.component.css']
})
export class ListPersonnelsComponent implements OnInit, AfterViewInit {

  myControl = new FormControl<string | IPersonnel>('');

  ELEMENTS_TABLE: IPersonnel[] = [];
  filteredOptions: IPersonnel[] | undefined;

  displayedColumns: string[] = ['nom', 'prenom', 'dateNaissance', 'sexe', 'email', 'telephone', 'dateEntree'];
  
  dataSource = new MatTableDataSource<IPersonnel>(this.ELEMENTS_TABLE);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private translate: TranslateService,private router:Router, private servicePersonnel:PersonnelsService, private _liveAnnouncer: LiveAnnouncer) { 

  }
  private getAllPersonnels(){
    return this.servicePersonnel.getAllPersonnels();
  }

  displayFn(user: IPersonnel): string {
    return user && user.nom ? user.nom : '';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public rechercherListingPersonnel(option: IPersonnel){
    this.servicePersonnel.getPersonnelsByName(option.nom.toLowerCase()).subscribe(
        valeurs => {this.dataSource.data = valeurs;}
    )
  }

  ngOnInit(): void {

    this.getAllPersonnels().subscribe(valeurs => {
      this.dataSource.data = valeurs;
    });

    this.myControl.valueChanges.subscribe(
      value => {
        const name = typeof value === 'string' ? value : value?.nom;
        if(name != undefined && name?.length >0){
          this.servicePersonnel.getPersonnelsByName(name.toLowerCase() as string).subscribe(
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

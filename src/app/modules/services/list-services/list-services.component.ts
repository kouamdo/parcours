import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild  } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, Observable } from 'rxjs';
import { IService } from 'src/app/modele/service';
import { ServicesService } from 'src/app/services/services/services.service';

export interface service {
  nom: string;
}

@Component({
  selector: 'app-list-services',
  templateUrl: './list-services.component.html',
  styleUrls: ['./list-services.component.scss']
})
export class ListServicesComponent implements OnInit, AfterViewInit {

  services$:Observable<IService[]>=EMPTY;

  myControl = new FormControl<string | IService>('');
 
  ELEMENTS_TABLE: IService[] = [];
  filteredOptions: IService[] | undefined;

  displayedColumns: string[] = ['nom', 'prenom', 'anniversaire', 'sexe', 'mail', 'adresse', 'telephone', 'actions'];
  
  dataSource = new MatTableDataSource<IService>(this.ELEMENTS_TABLE);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private translate: TranslateService, private router:Router, private serviceService:ServicesService,  private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {
    this.services$ = this.getAllServices();
    
    this.getAllServices().subscribe(valeurs => {
      this.dataSource.data = valeurs;
    });

    this.myControl.valueChanges.subscribe(
      value => {
        const libelle_service = typeof value === 'string' ? value : value?.libelle;
        if(libelle_service != undefined && libelle_service?.length >0){
          this.serviceService.getServiceByLibelle(libelle_service.toLowerCase() as string).subscribe(
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

  private getAllServices(){
    return this.serviceService.getAllServices();
  }
  displayFn(service: IService): string {
    return service && service.libelle ? service.libelle : '';
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  public rechercherListingService(option: IService){
    this.serviceService.getServiceByLibelle(option.libelle.toLowerCase()).subscribe(
        valeurs => {this.dataSource.data = valeurs;}
    )
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}

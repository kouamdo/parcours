import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, EMPTY } from 'rxjs';
import { IEtats } from 'src/app/modele/etats';
import { EtatService } from 'src/app/services/etats/etats.service';

@Component({
  selector: 'app-list-etats',
  templateUrl: './list-etats.component.html',
  styleUrls: ['./list-etats.component.scss']
})
export class ListEtatsComponent implements OnInit, AfterViewInit {

  services$:Observable<IEtats[]>=EMPTY;

  etatControl = new FormControl<string | IEtats>('');

  ELEMENTS_TABLE: IEtats[] = [];
  filteredOptions: IEtats[] | undefined;

  displayedColumns: string[] = ['libelle','description','actions'];

  dataSource = new MatTableDataSource<IEtats>(this.ELEMENTS_TABLE);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private translate: TranslateService, private router:Router, private serviceEtat:EtatService,  private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {
    this.services$ = this.getAllEtats();

    this.getAllEtats().subscribe(valeurs => {
      this.dataSource.data = valeurs;
      this.filteredOptions = valeurs
    });

    this.etatControl.valueChanges.subscribe(
      value => {
        const libelle_service = typeof value === 'string' ? value : value?.libelle;
        if(libelle_service != undefined && libelle_service?.length >0){
          this.serviceEtat.getEtatByLibelle(libelle_service.toLowerCase() as string).subscribe(
            reponse => {
              this.filteredOptions = reponse;
            }
          )
        }
        else{
          this.serviceEtat.getAllEtats().subscribe(
            (resultat) =>{
              this.filteredOptions = resultat
            }
          )
        }
      }
    );
  }

  private getAllEtats(){
    return this.serviceEtat.getAllEtats();
  }
  displayFn(service: IEtats): string {
    return service && service.libelle ? service.libelle : '';
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  public rechercherListingEtats(option: IEtats){
    this.serviceEtat.getEtatByLibelle(option.libelle.toLowerCase()).subscribe(
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

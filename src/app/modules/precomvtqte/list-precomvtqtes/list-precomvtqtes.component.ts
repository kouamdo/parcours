import { Component, OnInit, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, EMPTY } from 'rxjs';

import { TypeUnite } from 'src/app/modele/type-unite';

import { IRessource } from 'src/app/modele/ressource';
import { IPrecomvtqte } from 'src/app/modele/precomvtqte';
import { PrecomvtqtesService } from 'src/app/services/precomvtqtes/precomvtqtes.service';

@Component({
  selector: 'app-list-precomvtqtes',
  templateUrl: './list-precomvtqtes.component.html',
  styleUrls: ['./list-precomvtqtes.component.scss']
})
export class ListPrecomvtqtesComponent implements OnInit {
  precomvtqtes$:Observable<IPrecomvtqte>=EMPTY;

  myControl = new FormControl<string | IPrecomvtqte>('');

  ELEMENTS_TABLE: IPrecomvtqte[] = [];
  filteredOptions: IPrecomvtqte[] | undefined;
  displayedColumns: string[] = ['id','libelle','quantiteMin','quantiteMax','montantMin','montantMax','type','fournisseur','actions'];

  dataSource = new MatTableDataSource<IPrecomvtqte>(this.ELEMENTS_TABLE);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private translate: TranslateService,private router:Router, private servicePrecomvtqte:PrecomvtqtesService, private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {
    this.getAllPrecomvtqtes().subscribe(valeurs => {
      this.dataSource.data = valeurs;
    });

    this.myControl.valueChanges.subscribe(
      value => {
        const libelle = typeof value === 'string' ? value : value?.libelle;
        if(libelle != undefined && libelle?.length >0){
          this.servicePrecomvtqte.getPrecomvtqtesByLibelle(libelle.toLowerCase() as string).subscribe(
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

  private getAllPrecomvtqtes(){
    return this.servicePrecomvtqte.getAllPrecomvtqtes();
  }
  displayFn(precomvtqte: IPrecomvtqte): string {
    return precomvtqte && precomvtqte.libelle ? precomvtqte.libelle : '';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public rechercherListingPrecomvtqte(option: IPrecomvtqte){
    this.servicePrecomvtqte.getPrecomvtqtesByLibelle(option.libelle.toLowerCase()).subscribe(
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


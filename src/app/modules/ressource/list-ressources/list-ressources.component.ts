import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, EMPTY } from 'rxjs';
import { RessourcesService } from 'src/app/services/ressources/ressources.service';
import { IRessource } from 'src/app/modele/ressource';

@Component({
  selector: 'app-list-ressources',
  templateUrl: './list-ressources.component.html',
  styleUrls: ['./list-ressources.component.scss'],
})
export class ListRessourcesComponent implements OnInit {
  ressources$: Observable<IRessource> = EMPTY;

  myControl = new FormControl<string | IRessource>('');

  ELEMENTS_TABLE: IRessource[] = [];
  filteredOptions: IRessource[] | undefined;

  displayedColumns: string[] = [
    'libelle',
    'etat',
    'quantite',
    'unite',
    'prixEntree',
    'prixDeSortie',
    'famille',
    'caracteristique',
    'actions',
  ];

  dataSource = new MatTableDataSource<IRessource>(this.ELEMENTS_TABLE);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private serviceRessource: RessourcesService,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  ngOnInit(): void {
    this.getAllRessources().subscribe((valeurs) => {
      this.dataSource.data = valeurs;
      this.filteredOptions = valeurs;
    });

    this.myControl.valueChanges.subscribe((value) => {
      const libelle = typeof value === 'string' ? value : value?.libelle;
      if (libelle != undefined && libelle?.length > 0) {
        this.serviceRessource
          .getRessourcesByLibelle(libelle.toLowerCase() as string)
          .subscribe((reponse) => {
            this.filteredOptions = reponse;
          });
      } else {
        this.serviceRessource.getAllRessources().subscribe((reponse) => {
          this.filteredOptions = reponse;
        });
      }
    });
  }

  private getAllRessources() {
    return this.serviceRessource.getAllRessources();
  }
  displayFn(attribue: IRessource): string {
    return attribue && attribue.libelle ? attribue.libelle : '';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public rechercherListingRessource(option: IRessource) {
    this.serviceRessource
      .getRessourcesByLibelle(option.libelle.toLowerCase())
      .subscribe((valeurs) => {
        this.dataSource.data = valeurs;
      });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { IParours } from 'src/app/modele/parours';
import { ParoursService } from 'src/app/services/parours/parours.service';
import { IAfficheParours } from 'src/app/modele/affiche-parours';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-list-parours',
  templateUrl: './list-parours.component.html',
  styleUrls: ['./list-parours.component.scss'],
})
export class ListParoursComponent implements OnInit {
  //parours$:Observable<IParours[]>=EMPTY;
  myControl = new FormControl<string | IParours>('');

  //ELEMENTS_TABLE: IParours[] = [];
  ELEMENTS_TABLE: IAfficheParours[] = [];
  filteredOptions: IParours[] | undefined;

  displayedColumns: string[] = ['libelle', 'etape', 'actions'];

  dataSource = new MatTableDataSource<IParours>(this.ELEMENTS_TABLE);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  tableParours: IAfficheParours[] = [];
  afficheParours: IAfficheParours = {
    id: '',
    libelle: '',
    etape: [],
    listeEtape: '',
  };
  constructor(
    private translate: TranslateService,
    private router: Router,
    private _liveAnnouncer: LiveAnnouncer,
    private serviceParour: ParoursService
  ) {}

  ngOnInit(): void {
    this.getAllParours().subscribe((valeurs) => {
      const tableParours: IAfficheParours[] = [];

      valeurs.forEach((x) => {
        tableParours.push(this.convertParToParAffiche(x));
      });
      this.dataSource.data = tableParours;
    });

    this.myControl.valueChanges.subscribe((value) => {
      const libelle = typeof value === 'string' ? value : value?.libelle;
      if (libelle != undefined && libelle?.length > 0) {
        this.serviceParour
          .getParoursBylibelle(libelle.toLowerCase() as string)
          .subscribe((reponse) => {
            this.filteredOptions = reponse;
          });
      } else {
        this.filteredOptions = [];
      }
    });
  }

  displayFn(parours: IParours): string {
    return parours && parours.libelle ? parours.libelle : '';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public rechercherListingParours(option: IParours) {
    this.serviceParour
      .getParoursBylibelle(option.libelle.toLowerCase())
      .subscribe((valeurs) => {
        const tableParours: IAfficheParours[] = [];
        valeurs.forEach((x) => {
          tableParours.push(this.convertParToParAffiche(x));
        });
        this.dataSource.data = tableParours;
      });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  private getAllParours() {
    return this.serviceParour.getAllParours();
  }

  private convertParToParAffiche(x: IParours): IAfficheParours {
    let afficheParours: IAfficheParours = {
      id: '',
      libelle: '',
      etape: [],
      listeEtape: '',
    };
    console.log('parc', afficheParours);
    afficheParours.id = x.id;
    afficheParours.libelle = x.libelle;
    afficheParours.etape = x.etape;
    x.etape.forEach((e) => {
      afficheParours.listeEtape += e.libelle + ', ';
    });
    return afficheParours;
  }
}

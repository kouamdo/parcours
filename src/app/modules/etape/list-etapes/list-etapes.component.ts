import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, Observable } from 'rxjs';
import { IService } from 'src/app/modele/service';
import { ITicket } from 'src/app/modele/ticket';
import { ServicesService } from 'src/app/services/services/services.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { IEtape } from 'src/app/modele/etape';
import { EtapesService } from 'src/app/services/etapes/etapes.service';
import { IDocument } from 'src/app/modele/document';
import { IAfficheDocument } from 'src/app/modele/affiche-document';
import { IAfficheEtape } from 'src/app/modele/affiche-etape';

export interface User {
  libelle: string;
}

@Component({
  selector: 'app-list-etapes',
  templateUrl: './list-etapes.component.html',
  styleUrls: ['./list-etapes.component.scss'],
})
export class ListEtapesComponent implements OnInit {
  id_etape: string = '0';
  id_service: number = 0;
  libelle_etape: string = '';
  libelle_service: string = '';

  myControl = new FormControl<string | IEtape>('');

  ELEMENTS_TABLE: IAfficheEtape[] = [];
  filteredOptions: IEtape[] | undefined;

  displayedColumns: string[] = ['libelle', 'etat', 'Document', 'actions'];

  dataSource = new MatTableDataSource<IAfficheEtape>(this.ELEMENTS_TABLE);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  tableDocuments: IAfficheEtape[] = [];

  afficheEtape: IAfficheEtape = {
    id: '',
    libelle: '',
    etat: false,
    document: [],
    listSousDocuments: '',
  };
  constructor(
    private translate: TranslateService,
    private router: Router,
    private serviceEtape: EtapesService,
    private _liveAnnouncer: LiveAnnouncer,
    private serviceService: ServicesService,
    private serviceTicket: TicketsService
  ) {}

  ngOnInit(): void {
    /*this.getAllEtapes().subscribe(valeurs => {
      this.dataSource.data = valeurs;
    });*/

    this.getAllEtapes().subscribe((valeurs) => {
      const tableDocuments: IAfficheEtape[] = [];

      valeurs.forEach((x) => {
        tableDocuments.push(this.convertEtapToEtapAffiche(x));
      });
      this.dataSource.data = tableDocuments;
    });
  }

  setIdEtape(id_etape: string, libelle_etape: string) {
    this.id_etape = id_etape;
    this.libelle_etape = libelle_etape;
    sessionStorage.setItem('id_etape', this.id_etape.toString());
    sessionStorage.setItem('libelle_etape', this.libelle_etape);
  }
  setlibelleService(id_service: number, libelleService: string) {
    this.libelle_service = libelleService;
    this.id_service = id_service;

    sessionStorage.setItem('id_service', this.id_service.toString());
    sessionStorage.setItem('libelle_service', this.libelle_service);
  }

  private getAllEtapes() {
    return this.serviceEtape.getAllEtapes();
  }

  displayFn(user: IEtape): string {
    return user && user.libelle ? user.libelle : '';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /*VRAIpublic rechercherListingEtape(option: IEtape){
    this.serviceEtape.getEtapesBylibelle(option.getEtapesBylibelle.toLowerCase()).subscribe(
        valeurs => {this.dataSource.data = valeurs;}
    )
  }*/

  public rechercherListingEtape(option: IEtape) {
    this.serviceEtape
      .getEtapesBylibelle(option.libelle.toLowerCase())
      .subscribe((etapes) => {
        if (etapes.length > 0) {
          const etape = etapes[0];
          this.serviceEtape.getEtapeById(etape.id).subscribe((documents) => {
            const tableDocuments: IAfficheEtape[] = [];
            tableDocuments.push(this.convertEtapToEtapAffiche(etape));
            this.dataSource.data = tableDocuments;
          });
        } else {
          this.dataSource.data = [];
        }
      });
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

  private convertEtapToEtapAffiche(x: IEtape): IAfficheEtape {
    console.log(x.document);

    let afficheEtape: IAfficheEtape = {
      id: '',
      libelle: '',
      etat: false,
      document: [],
      listSousDocuments: '',
    };
    afficheEtape.id = x.id;
    afficheEtape.libelle = x.libelle;
    afficheEtape.etat = x.etat;

    x.document.forEach(
      (d) => (afficheEtape.listSousDocuments += d.titre + ', ')
    );
    afficheEtape.listSousDocuments = afficheEtape.listSousDocuments.replace(
      /,\s*$/,
      ''
    );

    return afficheEtape;
  }
}

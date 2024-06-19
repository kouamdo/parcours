import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { IEtape } from 'src/app/modele/etape';
import { IParours } from 'src/app/modele/parours';
import { IService } from 'src/app/modele/service';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { EtapesService } from 'src/app/services/etapes/etapes.service';
import { ParoursService } from 'src/app/services/parours/parours.service';
import { ServicesService } from 'src/app/services/services/services.service';
import { v4 as uuidv4 } from 'uuid';
import { MatDialog } from '@angular/material/dialog';
import { NewEtapeComponent } from '../../etape/new-etape/new-etape.component';
import { IAfficheEtape } from 'src/app/modele/affiche-etape';
import { LiveAnnouncer } from '@angular/cdk/a11y';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogConfig } from '@angular/material/dialog';

export interface User {
  libelle: string;
}

@Component({
  selector: 'app-new-parours',
  templateUrl: './new-parours.component.html',
  styleUrls: ['./new-parours.component.scss'],
})
export class NewParoursComponent implements OnInit {
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

  parours: IParours = {
    id: '',
    libelle: '',
    //dateCreation?:Date,
    etape: [],
  };
  //parours : IParours|undefined;
  forme: FormGroup;
  btnLibelle: string = 'Ajouter';
  submitted: boolean = false;
  etape$: Observable<IEtape[]> = EMPTY;
  idService: string = '';
  //service : IService | undefined
  serviceDeEtape!: IService;

  constructor(
    private formBuilder: FormBuilder,
    private dataEnteteMenuService: DonneesEchangeService,
    private serviceParours: ParoursService,
    private router: Router,
    private infosPath: ActivatedRoute,
    private datePipe: DatePipe,
    private serviceEtape: EtapesService,
    private dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private serviceService: ServicesService
  ) {
    this.forme = this.formBuilder.group({
      libelle: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      //etape: ['', Validators.required]
      _etape: new FormControl<IEtape[]>([]),
    });
  }

  openNewEtape(etapeId?: string) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = '90%';
    dialogConfig.height = '80%';
    dialogConfig.autoFocus = true;

    if (etapeId) {
      dialogConfig.data = { idEtape: etapeId }; // Pass the etape ID to the modal
    }

    const dialogRef = this.dialog.open(NewEtapeComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      this.getAllEtapes().subscribe((valeurs) => {
        const tableDocuments: IAfficheEtape[] = [];

        valeurs.forEach((x) => {
          tableDocuments.push(this.convertEtapToEtapAffiche(x));
        });
        this.dataSource.data = tableDocuments;
        console.log('etapes', tableDocuments);
      });
      if (result) {
        let idParours = this.infosPath.snapshot.paramMap.get('idParours');
        console.log('idparcours', idParours);

        if (!etapeId || idParours != null) {
          console.log('res', result);

          // Assign the new etape to the form control
          const currentEtape = this.forme.controls['_etape'].value as IEtape[];
          const index = currentEtape.findIndex((et) => et.id === result.id);
          if (index >= 0) {
            currentEtape[index] = result;
          } else {
            currentEtape.push(result);
          }
          this.forme.controls['_etape'].setValue(currentEtape);
        }
      }
    });
  }
  getEtapeLibelles(): string {
    const etapes = this.forme.controls['_etape'].value as IEtape[];
    return etapes.map((etape) => etape.libelle).join(', ');
  }

  ngOnInit(): void {
    this.getAllEtapes().subscribe((valeurs) => {
      const tableDocuments: IAfficheEtape[] = [];

      valeurs.forEach((x) => {
        tableDocuments.push(this.convertEtapToEtapAffiche(x));
      });
      this.dataSource.data = tableDocuments;
      console.log('etapes', tableDocuments);
    });

    this.myControl.valueChanges.subscribe((value) => {
      const name = typeof value === 'string' ? value : value?.libelle;
      if (name != undefined && name?.length > 0) {
        this.serviceEtape
          .getEtapesBylibelle(name.toLowerCase() as string)
          .subscribe((reponse) => {
            this.filteredOptions = reponse;
            console.log('item', this.filteredOptions);
          });
      } else {
        this.filteredOptions = [];
      }
    });

    this.etape$ = this.getAllEtapes();
    let idParours = this.infosPath.snapshot.paramMap.get('idParours');
    if (idParours != null && idParours !== '') {
      this.btnLibelle = 'Modifier';
      this.serviceParours.getParoursById(idParours).subscribe((x) => {
        this.parours = x;
        this.forme.setValue({
          libelle: this.parours.libelle,
          //etape: this.parours.etape
          _etape: this.parours.etape,
        });
        this.forme.controls['_etape'].setValue(this.parours.etape);
      });
    }
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

  displayFn(user: IEtape): string {
    return user && user.libelle ? user.libelle : '';
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
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

  get f() {
    return this.forme.controls;
  }
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

  onSubmit(paroursInput: any) {
    this.submitted = true;
    if (
      this.forme.invalid ||
      (paroursInput._etape && paroursInput._etape.length < 1)
    )
      return;

    let paroursTemp: IParours = {
      id: uuidv4(),
      libelle: paroursInput.libelle,
      etape: paroursInput._etape,
    };

    if (this.parours.id != '') {
      paroursTemp.id = this.parours.id;
    }
    this.serviceParours.ajouterParours(paroursTemp).subscribe((object) => {
      this.router.navigate(['/list-parours']);
    });
  }

  private getAllEtapes() {
    return this.serviceEtape.getAllEtapes();
  }
  compareItem(etape1: IEtape, etape2: IEtape) {
    return etape2 && etape1 ? etape2.id === etape1.id : etape2 === etape1;
  }
}

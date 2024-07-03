import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, Observable } from 'rxjs';
import { IPatient } from 'src/app/modele/Patient';
import { IService } from 'src/app/modele/service';
import { ITicket } from 'src/app/modele/ticket';
import { PatientsService } from 'src/app/services/patients/patients.service';
import { ServicesService } from 'src/app/services/services/services.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { NewTicketComponent } from '../../tickets/new-ticket/new-ticket.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalCodebarreService } from '../../shared/modal-codebarre/modal-codebarre.service';
import { ModalCodebarreScanContinueComponent } from '../../shared/modal-codebarre-scan-continue/modal-codebarre-scan-continue.component';

export interface User {
  nom: string;
}

@Component({
  selector: 'app-list-patients',
  templateUrl: './list-patients.component.html',
  styleUrls: ['./list-patients.component.scss'],
})
export class ListPatientsComponent implements OnInit, AfterViewInit {
  @ViewChild('barcodeScanner', { static: false })
  barcodeScanner!: ModalCodebarreScanContinueComponent;
  patients$: Observable<IPatient[]> = EMPTY;
  services$: Observable<IService[]> = EMPTY;
  tickets$: Observable<ITicket[]> = EMPTY;

  id_personne: string = '0';
  id_service: number = 0;
  nom_patient: string = '';
  libelle_service: string = '';
  currentDate: Date = new Date();

  myControl = new FormControl<string | IPatient>('');

  ELEMENTS_TABLE: IPatient[] = [];
  //filteredOptions: IPatient[] | undefined;
  filteredOptions: IPatient[] | undefined;
  displayedColumns: string[] = [
    'nom',
    'prenom',
    'anniversaire',
    'sexe',
    'mail',
    'adresse',
    'telephone',
    'actions',
  ];

  dataSource = new MatTableDataSource<IPatient>(this.ELEMENTS_TABLE);

  formPatient: FormGroup;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private servicePatient: PatientsService,
    private _liveAnnouncer: LiveAnnouncer,
    private serviceService: ServicesService,
    private serviceTicket: TicketsService,
    private formBuilder: FormBuilder,
    private dialogDef: MatDialog,
    private barService: ModalCodebarreService
  ) {
    this.formPatient = this.formBuilder.group({
      _listPatient: new FormArray([]),
    });
  }

  scan_val: any | undefined;

  ngOnInit(): void {
    this.barService.getCode().subscribe((dt) => {
      this.scan_val = dt;
      this.myControl.setValue(this.scan_val); // Définit la valeur initiale dans la barre de recherche
      this.handleScanValChange(); // Déclenche la recherche lorsque scan_val change

      this.myControl.valueChanges.subscribe(() => {
        this.handleScanValChange();
      });

      if (this.scan_val) {
        // Si scan_val est défini, effectuez une recherche pour obtenir la libelle correspondante
        this.handleScanValChange
      }
    });

    this.services$ = this.getAllServices();
    this.tickets$ = this.getAllTickets();

    this.getAllPatients().subscribe((valeurs) => {
      this.dataSource.data = valeurs;
      this.filteredOptions = valeurs;
    });

    this.myControl.valueChanges.subscribe((value) => {
      const query = value?.toString().toLowerCase(); // Convert to lower case for case-insensitive search
      if (query && query.length > 0) {
        // Search by name or ID
        this.servicePatient
          .getPatientsByName(query)
          .subscribe((reponse) => {
            this.filteredOptions = reponse;
          });
      } else {
        this.filteredOptions = [];
      }
    });
    const defaultValue = 'YourDefaultSearchValue'; // Remplacez par la valeur par défaut souhaitée
    this.myControl.setValue(defaultValue);
  }

  openBarcodeScanner(): void {
    console.log('Attempting to open barcode scanner');
    if (this.barcodeScanner) {
      console.log('barcodeScanner initialized');
      this.barcodeScanner.createMediaStream();
    } else {
      console.log('barcodeScanner is undefined in AfterViewInit');
    }
  }

  setIdPersonne(id_personne: string, nom_patient: string) {
    this.id_personne = id_personne;
    this.nom_patient = nom_patient;
    sessionStorage.setItem('id_patient', this.id_personne.toString());
    sessionStorage.setItem('nom_patient', this.nom_patient);
  }
  setLibelleService(id_service: number, libelleService: string) {
    this.libelle_service = libelleService;
    this.id_service = id_service;

    sessionStorage.setItem('id_service', this.id_service.toString());
    sessionStorage.setItem('libelle_service', this.libelle_service);
  }

  private getAllPatients() {
    return this.servicePatient.getAllPatients();
  }

  openNewTicketDialog() {
    this.dialogDef.open(NewTicketComponent, {
      height: '500px',
      width: '400px',
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '1000ms',
    });
  }

  displayFn(user: IPatient): string {
    return user && user.nom ? user.nom : '';
  }

  ngAfterViewInit() {
    if (this.barcodeScanner) {
      console.log('barcodeScanner initialized');
    } else {
      console.log('barcodeScanner is undefined');
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private handleScanValChange() {
    if (this.scan_val) {
      this.servicePatient.getPatientsByQrcode(this.scan_val).subscribe((response) => {
        if (response && response.length > 0) {
          const mainPatient = response[0];
          const relatedPatients = response.slice(1); // Assuming related patients are included in the response

          this.dataSource.data = [mainPatient, ...relatedPatients]; // Combine main patient and related patients
          this.filteredOptions = this.dataSource.data; // Update filtered options
        }
      });
    }
  }
  
  
  

  public rechercherListingPersonne(option: IPatient){
    this.servicePatient.getPatientsByName(option.nom.toLowerCase()).subscribe(
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

  private getAllServices() {
    return this.serviceService.getAllServices();
  }
  private getAllTickets() {
    return this.serviceTicket.getAllTickets();
  }
}

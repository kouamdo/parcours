import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, EMPTY } from 'rxjs';
import { IPatient } from 'src/app/modele/Patient';
import { StatutTicket } from 'src/app/modele/statut-ticket';
import { ITicket } from 'src/app/modele/ticket';
import { PatientsService } from 'src/app/services/patients/patients.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';

@Component({
  selector: 'app-list-tickets',
  templateUrl: './list-tickets.component.html',
  styleUrls: ['./list-tickets.component.scss'],
})
export class ListTicketsComponent implements OnInit, AfterViewInit {
  tickets$: Observable<ITicket[]> = EMPTY;
  ticketImpression: ITicket | undefined;
  patientCorrespondant: IPatient = {
    id: '',
    nom: '',
    adresse: '',
    mail: '',
    telephone: '',
    qrCodeValue: '',
    mdp: ''
  };
  idTicketImpression: string = '';
  statutTicketActif = StatutTicket.actif;
  statutTicketAttente = StatutTicket.attente;
  statutTicketTraite = StatutTicket.traite;

  myControl = new FormControl<string | ITicket>('');

  ELEMENTS_TABLE: ITicket[] = [];
  filteredOptions: ITicket[] | undefined;

  displayedColumns: string[] = [
    'id',
    'idUnique',
    'idFileAttente',
    'idPersonne',
    'statut',
    'actions',
  ];

  dataSource = new MatTableDataSource<ITicket>(this.ELEMENTS_TABLE);
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private serviceTicket: TicketsService,
    private _liveAnnouncer: LiveAnnouncer,
    private servicePatient: PatientsService
  ) {}

  ngOnInit(): void {
    this.tickets$ = this.getAllTickets();
    this.ticketImpression = {
      id: '1',
      idUnique: '',
      date_heure: new Date(),
      idFileAttente: null,
      idPersonne: null,
      statut: '',
    };

    this.serviceTicket.getAllTickets().subscribe((reponse) => {
      this.filteredOptions = reponse;
    });

    this.getAllTickets().subscribe((valeurs) => {
      this.dataSource.data = valeurs;

      this.myControl.valueChanges.subscribe((value) => {
        const uniqueId = typeof value === 'string' ? value : value?.idUnique;
        if (uniqueId != undefined && uniqueId?.length > 0) {
          this.serviceTicket
            .getTicketByIdUnique(uniqueId.toLowerCase() as string)
            .subscribe((reponse) => {
              this.filteredOptions = reponse;
            });
        } else {
          this.serviceTicket.getAllTickets().subscribe((reponse) => {
            this.filteredOptions = reponse;
          });
        }
      });
    });
  }

  displayFn(ticket: ITicket): string {
    return ticket && ticket.idUnique ? ticket.idUnique : '';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public rechercherListingTicket(option: ITicket) {
    this.serviceTicket
      .getTicketByIdUnique(option.idUnique.toLowerCase())
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

  recupIdTicket(idTicket: string) {
    this.idTicketImpression = idTicket;
  }

  ticketAImprimer() {
    this.serviceTicket
      .getTicketById(this.idTicketImpression)
      .subscribe((objet) => {
        this.ticketImpression = objet;
        if (this.ticketImpression?.idPersonne) {
          this.servicePatient
            .getPatientById(this.ticketImpression?.idPersonne)
            .subscribe((valeur) => {
              this.patientCorrespondant = valeur;
            });
        }
      });
  }

  private getAllTickets() {
    return this.serviceTicket.getAllTickets();
  }
}

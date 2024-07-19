import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { IService } from 'src/app/modele/service';
import { ITicket } from 'src/app/modele/ticket';
import { IPatient } from 'src/app/modele/Patient';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { ServicesService } from 'src/app/services/services/services.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { PatientsService } from 'src/app/services/patients/patients.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-ticket',
  templateUrl: './new-ticket.component.html',
  styleUrls: ['./new-ticket.component.scss'],
})
export class NewTicketComponent implements OnInit {
  @Input() flag: boolean = false;

  ticket: ITicket | undefined;
  nopersonnesRatacheesSelected: boolean = true;
  forme: FormGroup;
  btnLibelle: string = 'Enregistrer';
  selectedpersonnesRatachees: IPatient | null = null;
  submitted: boolean = false;
  btnLibelleNew: string = 'Enregistrer';
  currentDate = new Date();
  strIidPersonne: string = '';
  idPersonne: string = '0';
  nomPersonne: string | null = '';
  id_service: string = '0';
  libelleService: string | null = '';
  id_ticket: string = '0';
  libelle_service: string = '';
  step: any = 1;

  services$: Observable<IService[]> = EMPTY;
  tickets$: Observable<ITicket[]> = EMPTY;
  personnesRatacheess$: Observable<IPatient[]> = EMPTY;
  _ticket: ITicket = {
    id: '0',
    idUnique: '',
    date_heure: new Date(),
    idFileAttente: null,
    idPersonne: null,
    statut: '',
  };
  titre: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private dataEnteteMenuService: DonneesEchangeService,
    private ticketsService: TicketsService,
    private router: Router,
    private infosPath: ActivatedRoute,
    private serviceService: ServicesService,
    private datePipe: DatePipe,
    private patientsService: PatientsService,
    @Optional() public dialogRef?: MatDialogRef<NewTicketComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
    this.forme = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.personnesRatacheess$ = this.getpersonnesRatacheess();
    this.btnLibelleNew = 'Continuer';
    this.services$ = this.getAllServices();
    this.libelle_service = localStorage.getItem('libelle_service') || '';
    let idTicket = this.infosPath.snapshot.paramMap.get('idTicket');
    if (idTicket != null && idTicket !== '') {
      this.btnLibelle = 'Modifier';
      this.titre = 'Ticket à Modifier';
      this.ticketsService.getTicketById(idTicket).subscribe((x) => {
        this.ticket = x;
        this.forme.setValue({
          idUnique: this.ticket.idUnique,
          date_heure: this.ticket.date_heure,
          idFileAttente: this.ticket.idFileAttente,
          idPersonne: this.ticket.idPersonne,
          statut: this.ticket.statut,
        });
      });
    }
    this.titre = this.dataEnteteMenuService.dataEnteteMenu;
  }

  get f() {
    return this.forme.controls;
  }

  onSubmit(ticketInput: any) {
    this.submitted = true;

    this.nomPersonne = sessionStorage.getItem('nom_patient');
    this.libelleService = sessionStorage.getItem('libelle_service');
    // Validation de l'élément non conforme
    if (this.forme.invalid) return;
    const idPatient = sessionStorage.getItem('id_patient');
    if (this.step === 1) {
      if (idPatient) {
        this.personnesRatacheess$ = this.patientsService.getPatientpersonnesRatacheess(idPatient);
        this.personnesRatacheess$.subscribe((personnesRatacheess) => {
          if (personnesRatacheess.length > 0) {
            this.nextStep();
          } else {
            this.step = 3; // Passer à l'étape 3 s'il n'y a pas d'associés
          }
        });
      }
    } else if (this.step === 2) {
      this.nextStep();
    } else if (this.step === 3) {
      this.ticketsService
        .attribuerTicket(
          sessionStorage.getItem('id_patient'),
          sessionStorage.getItem('id_service')
        )
        .subscribe((object) => {
          this._ticket = object;
          sessionStorage.setItem('idFileAttente', this._ticket.idFileAttente!);
          this._ticket.idPersonne = sessionStorage.getItem('nom_patient');
        });

      this.nextStep();
    }
    if (this.data?.step === 1) {
      console.log("hello", this.data.step);
      
      this.router.navigate(['parcours/patients/list-patient']);
      this.dialogRef?.close();
    }
  }

  nextStep() {
    this.step += 1;
  }

  getpersonnesRatacheess(): Observable<IPatient[]> {
    const idPatient = sessionStorage.getItem('id_patient');
    if (idPatient) {
      return this.patientsService.getPatientpersonnesRatacheess(idPatient);
    }
    return EMPTY;
  }

  togglepersonnesRatacheesSelection(personnesRatachees: IPatient) {
    if (!this.isSelected(personnesRatachees)) {
      this.btnLibelleNew = 'Continuer'; // Changer le titre du bouton si aucun associé n'est sélectionné
      this.patientsService.addSelectedpersonnesRatachees(personnesRatachees); // Add personnesRatachees if not already selected
      this.selectedpersonnesRatachees = personnesRatachees;
    } else {
      this.btnLibelleNew = 'Enregistrer'; // Réinitialiser le titre du bouton si un associé est sélectionné
      this.patientsService.removeSelectedpersonnesRatachees(personnesRatachees); // Remove personnesRatachees if already selected
      this.selectedpersonnesRatachees = null;
    }
  }

  isSelected(personnesRatachees: IPatient): boolean {
    return this.patientsService.selectedpersonnesRatacheess.some(
      (a) => a.id === personnesRatachees.id
    );
  }

  previousStep() {
    if (this.step === 3) {
      this.personnesRatacheess$.subscribe((personnesRatacheess) => {
        if (!personnesRatacheess || personnesRatacheess.length === 0) {
          this.step = 1; // S'il n'y a pas d'associés et que l'on revient de l'étape 3, aller à l'étape 1
        } else {
          this.step = 2; // S'il y a des associés, revenir à l'étape précédente
        }
      });
    } else {
      this.step -= 1;
    }
  }

  private getAllServices() {
    return this.serviceService.getAllServices();
  }

  setLibelleService(id_service: string, libelleService: string) {
    this.libelle_service = libelleService;
    this.id_service = id_service;

    sessionStorage.setItem('id_service', this.id_service.toString());
    sessionStorage.setItem('libelle_service', this.libelle_service);
  }

  isServiceSelected(serviceId: string): boolean {
    return sessionStorage.getItem('id_service') === serviceId;
  }

  private getTicketById(id: string) {
    return this.ticketsService.getTicketById(id);
  }

  removeData() {
    sessionStorage.clear();
  }
}

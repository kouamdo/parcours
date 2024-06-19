import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientsService } from 'src/app/services/patients/patients.service';
import { IPatient } from '../../../modele/Patient';
import { v4 as uuidv4 } from 'uuid';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-new-patient',
  templateUrl: './new-patient.component.html',
  styleUrls: ['./new-patient.component.scss'],
})
export class NewPatientComponent implements OnInit {
  //patient$:Observable<patientient>=EMPTY;
  patient: IPatient | undefined;
  forme: FormGroup;
  btnLibelle: string = 'Ajouter';
  submitted: boolean = false;
  titre: string = '';
  myControl = new FormControl<string | IPatient>('');
  initialDate = new FormControl(new Date());
  qrCodeValue: string = '';

  ELEMENTS_TABLE: IPatient[] = [];
  personnesRatachees: IPatient[] = [];

  dataSource = new MatTableDataSource<IPatient>(this.ELEMENTS_TABLE);

  displayFn(patient: IPatient): string {
    return patient && patient.nom
      ? patient.nom
      : patient && patient.toString
      ? patient.toString()
      : '';
  }

  filteredOptions: IPatient[] | undefined;

  public rechercherListingPersonne(option: IPatient) {
    this.patientService
      .getPatientsByName(option.nom.toLowerCase())
      .subscribe((valeurs) => {
        this.dataSource.data = valeurs;
      });
  }

  onSelectPersonne(event: MatAutocompleteSelectedEvent): void {
    const selectedPersonne: IPatient = event.option.value;

    if (this.personnesRatachees.length < 2) {
      if (this.forme && this.forme.get('myControl')) {
        this.forme.get('myControl')!.setValue('');
      }

      this.personnesRatachees.push(selectedPersonne);

      this.forme.get('myControl')!.setValue('');
    } else {
      alert('Désolé! impossible de ratacher plus de deux patients');
      this.forme.get('myControl')!.setValue('');
    }
  }

  // Function to filter autocomplete options based on already selected personnesRatachees
  filterAutocompleteOptions() {
    if (
      this.filteredOptions &&
      this.filteredOptions.length > 0 &&
      this.personnesRatachees.length > 0 &&
      typeof this.myControl.value === 'string' &&
      this.myControl.value.trim().length > 0
    ) {
      const nom = this.myControl.value.trim().toLowerCase();
      // Filter out already selected personnesRatachees
      this.filteredOptions = this.filteredOptions.filter(
        (option) =>
          !this.personnesRatachees.some(
            (person) => person.id?.toLowerCase() === option.id?.toLowerCase()
          )
      );
    }
  }

  removePersonne(index: number): void {
    this.personnesRatachees.splice(index, 1);
    this.forme.get('myControl')?.setValue('');
  }

  //TODO validation du formulaire. particulièrment les mail; les dates
  constructor(
    private formBuilder: FormBuilder,
    private dataEnteteMenuService: DonneesEchangeService,
    private patientService: PatientsService,
    private router: Router,
    private infosPath: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    this.forme = this.formBuilder.group({
      nom: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      prenom: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      sexe: ['M'],
      mail: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('.+@.+.{1}[a-z]{2,3}'),
        ],
      ],
      mdp: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('/[A-Z]+/./[a-z]+/./[!@#$%^&*(),.?":{}|<>]+/'),
        ],
      ],
      //todo initialisation du composant à une date
      dateNaissance: ['1980-01-01', Validators.required],
      telephone: [''],
      adresse: [''],
      myControl: [''],
      personnesRatachees: [[]],
    });

    this.myControl.valueChanges.subscribe((value) => {
      const nom = typeof value === 'string' ? value : value?.nom;
      if (nom && nom.length > 0) {
        // Search by name or ID
        this.patientService
          .getPatientsByName(nom.toLowerCase())
          .subscribe((reponse) => {
            this.filteredOptions = reponse;
            this.filterAutocompleteOptions();
          });
      } else {
        this.filteredOptions = [];
      }
    });
    this.myControl.registerOnChange(() => {
    });
  }

  ngOnInit() {
    let idPatient = this.infosPath.snapshot.paramMap.get('idPatient');
    if (idPatient != null && idPatient !== '') {
      this.btnLibelle = 'Modifier';
      this.titre = 'Patient à Modifier';

      //trouver un autre moyen d'initialiser avec des valeurs
      this.patientService.getPatientById(idPatient).subscribe((x) => {
        this.patient = x;

        this.personnesRatachees = this.patient.personnesRatachees || [];
        this.forme.setValue({
          nom: this.patient.nom,
          prenom: this.patient.prenom,
          sexe: this.patient.sexe,
          mail: this.patient.mail,
          dateNaissance: this.datePipe.transform(
            this.patient.dateNaissance,
            'yyyy-MM-dd'
          ), // je change le format de la date de naissance pour pouvoir l'afficher dans mon input type date
          telephone: this.patient.telephone,
          adresse: this.patient.adresse,
          personnesRatachees: this.personnesRatachees,
          myControl: [],
        });
      });
    }
  }

  get f() {
    return this.forme.controls;
  }

  onSubmit(patientInput: any) {
    this.submitted = true;
    //Todo la validation d'element non conforme passe
    if (this.forme.invalid) return;
    if (!patientInput.id) {
      patientInput.id = uuidv4();
    }

    if (this.personnesRatachees.length > 0) {
      patientInput.qrCodeValue = '';
    } else {
      patientInput.qrCodeValue = patientInput.id;
    }

    let patientTemp: IPatient = {
      id: patientInput.id,
      nom: patientInput.nom,
      prenom: patientInput.prenom,
      sexe: patientInput.sexe,
      adresse: patientInput.adresse,
      mail: patientInput.mail,
      telephone: patientInput.telephone,
      dateNaissance: patientInput.dateNaissance,
      qrCodeValue: patientInput.qrCodeValue,
      personnesRatachees: this.personnesRatachees,
      mdp: patientInput.mdp
    };

    patientTemp.dateNaissance = this.initialDate.value!;

    if (this.patient != undefined) {
      patientTemp.id = this.patient.id;
    }
    this.patientService.ajouterPatient(patientTemp).subscribe((object) => {
      this.router.navigate(['/list-patients']);
    });
  }
}

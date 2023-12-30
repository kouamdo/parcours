import { DatePipe } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup,MaxLengthValidator,MinLengthValidator,ReactiveFormsModule, Validators  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, isEmpty, Observable } from 'rxjs';
import { PatientsService } from 'src/app/services/patients/patients.service';
import {IPatient} from '../../../modele/Patient';
import {v4 as uuidv4} from 'uuid';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';


@Component({
  selector: 'app-new-patient',
  templateUrl: './new-patient.component.html',
  styleUrls: ['./new-patient.component.scss']
})
export class NewPatientComponent implements OnInit {
  //patient$:Observable<patientient>=EMPTY;
  patient : IPatient|undefined;
  forme: FormGroup;
  btnLibelle: string="Ajouter";
  submitted: boolean=false;
  initialDate = new FormControl(new Date());
  titre:string='';
  //TODO validation du formulaire. particulièrment les mail; les dates
  constructor(private formBuilder:FormBuilder,private dataEnteteMenuService:DonneesEchangeService, private patientService:PatientsService,private router:Router, private infosPath:ActivatedRoute, private datePipe: DatePipe) {
    this.forme =  this.formBuilder.group({
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      sexe: ['M'],
      mail: ['', [Validators.required, Validators.email, Validators.pattern(".+@.+\.{1}[a-z]{2,3}")]],
      //todo initialisation du composant à une date
      dateNaissance: ['1980-01-01', Validators.required],
      telephone: [''],
      adresse: ['']
    })
  }

  ngOnInit() {
    this.titre=this.dataEnteteMenuService.dataEnteteMenu
    let idPatient = this.infosPath.snapshot.paramMap.get('idPatient');
    if((idPatient != null) && idPatient!==''){

      this.btnLibelle="Modifier";
      this.titre="Patient à Modifier";

      //trouver un autre moyen d'initialiser avec des valeurs
      this.patientService.getPatientById(idPatient).subscribe(x =>
      {
        this.patient = x;
        this.forme.setValue({
          nom: this.patient.nom,
          prenom: this.patient.prenom,
          sexe: this.patient.sexe,
          mail: this.patient.mail,
          dateNaissance: this.datePipe.transform(this.patient.dateNaissance,'yyyy-MM-dd'), // je change le format de la date de naissance pour pouvoir l'afficher dans mon input type date
          telephone: this.patient.telephone,
          adresse: this.patient.adresse
        })
      });
    }
    this.titre=this.dataEnteteMenuService.dataEnteteMenu
  }

  get f(){
    return this.forme.controls;
  }

  onSubmit(patientInput:any){
    this.submitted=true;
    //Todo la validation d'element non conforme passe
    if(this.forme.invalid) return;

    let patientTemp : IPatient={
      id: uuidv4(),
      nom:patientInput.nom,
      prenom:patientInput.prenom,
      sexe:patientInput.sexe,
      adresse:patientInput.adresse,
      mail:patientInput.mail,
      telephone:patientInput.telephone,
      dateNaissance:patientInput.dateNaissance
    }
    patientTemp.dateNaissance = this.initialDate.value!

    if(this.patient != undefined){
      patientTemp.id = this.patient.id
    }
    this.patientService.ajouterPatient(patientTemp).subscribe(
      object => {
        this.router.navigate(['/list-patients']);
      }
    )
  }
}

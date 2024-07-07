import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IPersonnel } from 'src/app/modele/personnel';
import { IUtilisateurs } from 'src/app/modele/utilisateurs';
import { AuthentificationService } from 'src/app/services/authentifications/authentification.service';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { PersonnelsService } from 'src/app/services/personnels/personnels.service';
import { UtilisateurService } from 'src/app/services/utilisateurs/utilisateur.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-detail-user',
  templateUrl: './detail-user.component.html',
  styleUrls: ['./detail-user.component.scss']
})
export class DetailUserComponent implements OnInit {
  //personnel$:Observable<personnel>=EMPTY;
  personnel: IPersonnel | undefined;
  user: IUtilisateurs | undefined;
  forme: FormGroup;
  btnLibelle: string = 'Ajouter';
  submitted: boolean = false;
  // Import the QRCodeModule
  qrCodeValue: string = '';
  titre: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private dataEnteteMenuService: DonneesEchangeService,
    private userService: UtilisateurService,
    private authService: AuthentificationService,
    private personnelService: PersonnelsService,
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
      lastPwd: [''],
      newPwd: [''],
      sexe: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('.+@.+.{1}[a-z]{2,3}'),
        ],
      ],
      //todo initialisation du composant à une date
      dateNaissance: ['1980-01-01', Validators.required],
      dateEntree: ['2023-01-01', Validators.required],
      dateSortie: ['0000-00-00'],
      telephone: ['', Validators.required],
    });
  }

  get f() {
    return this.forme.controls;
  }

  ngOnInit(): void {
    this.personnel = this.authService.currentUserValue.user;
    console.log("detail user:", this.personnel);
    
    this.forme.setValue({
      nom: this.personnel?.nom,
      prenom: this.personnel?.prenom,
      sexe: this.personnel?.sexe,
      email: this.personnel?.email,
      dateNaissance: this.datePipe.transform(
        this.personnel?.dateNaissance,
        'yyyy-MM-dd'
      ),
      dateEntree: this.datePipe.transform(
        this.personnel?.dateEntree,
        'yyyy-MM-dd'
      ),
      dateSortie: this.datePipe.transform(
        this.personnel?.dateSortie,
        'yyyy-MM-dd'
      ),
      telephone: this.personnel?.telephone,
      lastPwd: '',
      newPwd: ''
    });
  }

  onSubmit(personnelInput: any) {
    this.submitted = true;

    if (this.forme.invalid) return;

    let personnelTemp: IPersonnel = {
      id: uuidv4(),
      nom: personnelInput.nom,
      prenom: personnelInput.prenom,
      sexe: personnelInput.sexe,
      email: personnelInput.email,
      telephone: personnelInput.telephone,
      dateNaissance: personnelInput.dateNaissance,
      dateEntree: personnelInput.dateEntree,
      dateSortie: personnelInput.dateSortie,
      qrCodeValue: personnelInput.qrCodeValue,
    };
  }
}

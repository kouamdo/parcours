import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
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
      lastPwd: ['', [Validators.required]],
      newPwd: ['', [Validators.required, this.passwordValidator()]],
      nextPwd: ['', [Validators.required, this.passwordValidator()]],
    });
  }

  get f() {
    return this.forme.controls;
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;

      if (!passwordPattern.test(value)) {
        return { invalidPassword: true };
      }
      // Exclure des chaînes spécifiques
      if (value.includes(this.personnel?.nom) || value.includes(this.personnel?.dateNaissance)) {
        return { invalidPassword: true };
      }
      return null;
    };
  }

  ngOnInit(): void {
    this.personnel = this.authService.currentUserValue.user;
    console.log("detail user:", this.personnel);
  }

  return() {
    this.router.navigate(['parcours/personnels/list-personnels']);
  }

  onSubmit(personnelInput: any) {
    this.submitted = true;

    if (this.forme.invalid) return;

    if (personnelInput.newPwd == personnelInput.nextPwd) {
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
    } else {
      this.submitted = true;
      console.log("Les mots de passes ne correspondent pas !");
      
    }
  }
}

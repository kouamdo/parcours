import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { IComptes } from 'src/app/modele/comptes';
import { ComptesService } from 'src/app/services/comptes/comptes.service';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { IPersonnel } from 'src/app/modele/personnel';
import { PersonnelsService } from 'src/app/services/personnels/personnels.service';
import { IPatient } from 'src/app/modele/Patient';
import { PatientsService } from 'src/app/services/patients/patients.service';

@Component({
  selector: 'app-new-compte',
  templateUrl: './new-compte.component.html',
  styleUrls: ['./new-compte.component.scss'],
})
export class NewCompteComponent {
  compte: IComptes | undefined;
  forme: FormGroup;
  titre: string = '';
  btnLibelle: string = 'Ajouter';
  //titre: string="Ajouter Caisse";
  submitted: boolean = false;
  personnels: IPatient[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private dataEnteteMenuService: DonneesEchangeService,
    private compteService: ComptesService,
    private router: Router,
    private infosPath: ActivatedRoute,
    private datePipe: DatePipe,
    private userService: PatientsService
  ) {
    this.forme = this.formBuilder.group({
      libelle: ['', [Validators.required]],
      solde: [''],
      montantDecouvert: [''],
      personnel: new FormControl<string | IPatient>(''),
    });
  }

  ngOnInit(): void {
    let idCompte = this.infosPath.snapshot.paramMap.get('idCompte');
    this.userService.getAllPatients().subscribe((reponse) => {
      this.personnels = reponse;
    });
    if (idCompte != null && idCompte !== '') {
      this.btnLibelle = 'Modifier';
      this.titre = 'Compte à Modifier';
      this.compteService.getCompteById(idCompte).subscribe((x) => {
        this.compte = x;
        this.forme.setValue({
          libelle: this.compte?.libelle,
          solde: this.compte?.solde,
          montantDecouvert: this.compte?.montantDecouvertMax,
          personnel: this.compte.personnel,
        });
      });
    }
    this.titre = this.dataEnteteMenuService.dataEnteteMenu;
  }

  get f() {
    return this.forme.controls;
  }

  displayFn(peronne: IPatient): string {
    return peronne && peronne.nom ? peronne.nom : '';
  }

  return() {
    this.router.navigate(['/list-comptes']);
  }

  onSubmit(compteInput: any) {
    this.submitted = true;
    if (this.forme.invalid) return;

    let compteTemp: IComptes = {
      id: uuidv4(),
      libelle: compteInput.libelle,
      solde: compteInput.solde,
      dateCreation: new Date(),
      montantDecouvertMax: compteInput.montantDecouvert,
      personnel: compteInput.personnel,
    };

    if (this.compte != undefined) {
      compteTemp.id = this.compte.id;
      compteTemp.dateCreation = this.compte.dateCreation;
    }

    console.log('valeur final :', compteTemp);

    this.compteService.ajouterCompte(compteTemp).subscribe((object) => {
      this.router.navigate(['/list-comptes']);
    });
  }
}

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
  submitted: boolean = false;
  personnels: IPatient[] | undefined;

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
      beneficiaire: new FormControl<string | IPatient>(''),
    });
  }

  ngOnInit(): void {
    let idCompte = this.infosPath.snapshot.paramMap.get('idCompte');
    this.userService.getAllPatients().subscribe((reponse) => {
      this.personnels = reponse;
    });
    this.forme.controls['beneficiaire'].valueChanges.subscribe((value) => {
      const nom = typeof value === 'string' ? value : value?.nom;
      if (nom != undefined && nom?.length > 0) {
        this.userService
          .getPatientsByName(nom.toLowerCase() as string)
          .subscribe((reponse) => {
            this.personnels = reponse;
          });
      } else {
        this.userService.getAllPatients().subscribe((reponse) => {
          this.personnels = reponse;
        });
      }
    });
    if (idCompte != null && idCompte !== '') {
      this.btnLibelle = 'Modifier';
      this.titre = 'Compte à Modifier';
      this.forme.controls['solde'].disable();
      this.forme.controls['beneficiaire'].disable();
      this.compteService.getCompteById(idCompte).subscribe((x) => {
        this.compte = x;
        this.forme.setValue({
          libelle: this.compte?.libelle,
          solde: this.compte?.solde,
          montantDecouvert: this.compte?.montantDecouvertMax,
          beneficiaire: null,
        });
        if(this.compte.beneficiaire) this.forme.controls['beneficiaire'].setValue(this.compte.beneficiaire);
      });
    }
    this.titre = this.dataEnteteMenuService.dataEnteteMenu;
  }

  get f() {
    return this.forme.controls;
  }

  displayFn(personne: IPatient): string {
    return personne && personne.nom ? personne.nom : '';
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
      beneficiaire: compteInput.beneficiaire,
    };

    if (this.compte != undefined) {
      compteTemp.id = this.compte.id;
      compteTemp.solde = this.compte.solde;
      compteTemp.dateCreation = this.compte.dateCreation;
    }

    console.log('valeur final :', compteTemp);

    this.compteService.ajouterCompte(compteTemp).subscribe((object) => {
      this.router.navigate(['/list-comptes']);
    });
  }
}

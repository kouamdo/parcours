import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PromoService } from 'src/app/services/promo/promo.service';
import { DistributeursService } from 'src/app/services/distributeurs/distributeurs.service';
import { FamillesService } from 'src/app/services/familles/familles.service';
import { RessourcesService } from 'src/app/services/ressources/ressources.service';
import { Promo } from 'src/app/modele/promo-distributeur';
import { IDistributeur } from 'src/app/modele/distributeur';
import { IFamille } from 'src/app/modele/famille';
import { IRessource } from 'src/app/modele/ressource';
import { v4 as uuidv4 } from 'uuid';
import { Observable, forkJoin, of } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';

@Component({
  selector: 'app-new-promo',
  templateUrl: './new-promo.component.html',
  styleUrls: ['./new-promo.component.css'],
})
export class NewPromoComponent implements OnInit {
  titre:string='Ajouter Promotion';
  promo: Promo | undefined;
  promoForm: FormGroup;
  selectedOption: string = '';
  btnLibelle: string = 'Ajouter';
  submitted: boolean = false;
  filteredDistributeurs: Observable<IDistributeur[]> = of([]);
  filteredBeneficiaires: Observable<(IFamille | IRessource)[]> = of([]);
  selectedBeneficiaires: (IFamille | IRessource)[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private promoService: PromoService,
    private dataEnteteMenuService:DonneesEchangeService,
    private distributeursService: DistributeursService,
    private famillesService: FamillesService,
    private ressourcesService: RessourcesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.promoForm = this.formBuilder.group(
      {
        type: '',
        montant: ['', Validators.required],
        pourcentage: ['', [Validators.max(100)]],
        emetteur: ['', Validators.required],
        dateDebut: ['', Validators.required],
        dateFin: [''],
        code: ['', Validators.required],
        beneficiaire: [''],
      },
      { validators: [this.dateValidator] }
    );

    this.promoForm.get('type')?.valueChanges.subscribe((type) => {
      if (type === 'Montant') {
        this.promoForm.get('montant')?.setValidators([Validators.required]);
        this.promoForm.get('pourcentage')?.clearValidators();
      } else if (type === 'Pourcentage') {
        this.promoForm.get('montant')?.clearValidators();
        this.promoForm
          .get('pourcentage')
          ?.setValidators([Validators.required, Validators.max(100)]);
      }
      this.promoForm.get('montant')?.updateValueAndValidity();
      this.promoForm.get('pourcentage')?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    const idPromo = this.route.snapshot.paramMap.get('idPromo');
    if (idPromo != null && idPromo !== '') {
      this.titre="Promotion à Modifier";
      this.btnLibelle = 'Modifier';
      this.promoService.getPromoById(idPromo).subscribe((promo) => {
        this.promo = promo;
        this.selectedOption =
          promo.pourcentageRemise > 0 ? 'Pourcentage' : 'Montant';

        this.promoForm.patchValue({
          type: this.selectedOption,
          montant: promo.montantRemise,
          pourcentage: promo.pourcentageRemise,
          emetteur: promo.emetteur,
          dateDebut: promo.dateDebut,
          dateFin: promo.dateFin,
          code: promo.codeUnique,
        });

        this.selectedBeneficiaires = [
          ...(promo.famille || []),
          ...(promo.ressource || []),
        ];
      });
    }

    this.filteredDistributeurs = this.promoForm
      .get('emetteur')!
      .valueChanges.pipe(
        startWith(''),
        map((value) =>
          typeof value === 'string' ? value : value?.raisonSocial || ''
        ),
        switchMap((value) => this._filterDistributeurs(value || ''))
      );

    this.filteredBeneficiaires = this.promoForm
      .get('beneficiaire')!
      .valueChanges.pipe(
        startWith(''),
        map((value) =>
          typeof value === 'string' ? value : value?.libelle || ''
        ),
        switchMap((value) => this._filterBeneficiaires(value || ''))
      );

  }

  displayDistributeur(distributeur: IDistributeur): string {
    return distributeur && distributeur.raisonSocial
      ? distributeur.raisonSocial
      : '';
  }

  displayBeneficiaire(beneficiaire: IFamille | IRessource): string {
    return beneficiaire ? beneficiaire.libelle : '';
  }

  isFamille(beneficiaire: IFamille | IRessource): boolean {
    return (beneficiaire as IFamille).description !== undefined;
  }

  isRessource(beneficiaire: IFamille | IRessource): boolean {
    return (beneficiaire as IRessource).quantite !== undefined;
  }

  private _filterDistributeurs(value: string): Observable<IDistributeur[]> {
    if (!value) {
      return of([]);
    }
    return this.distributeursService
      .getAllDistributeurs()
      .pipe(
        map((distributeurs) =>
          distributeurs.filter((distributeur) =>
            distributeur.raisonSocial
              .toLowerCase()
              .includes(value.toLowerCase())
          )
        )
      );
  }

  private _filterBeneficiaires(
    value: string
  ): Observable<(IFamille | IRessource)[]> {
    if (!value) {
      return of([]);
    }
    const familles$ = this.famillesService
      .getAllFamilles()
      .pipe(
        map((familles) =>
          familles.filter((famille) =>
            famille.libelle.toLowerCase().startsWith(value.toLowerCase())
          )
        )
      );
    const ressources$ = this.ressourcesService
      .getAllRessources()
      .pipe(
        map((ressources) =>
          ressources.filter((ressource) =>
            ressource.libelle.toLowerCase().startsWith(value.toLowerCase())
          )
        )
      );
    return forkJoin({
      familles: familles$,
      ressources: ressources$,
    }).pipe(
      map(({ familles, ressources }) => {
        const allBeneficiaires = [...familles, ...ressources];
        return allBeneficiaires.filter(
          (beneficiaire) =>
            !this.selectedBeneficiaires.find(
              (selected) => selected.id === beneficiaire.id
            )
        );
      })
    );
  }

  get f() {
    return this.promoForm.controls;
  }

  dateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const dateDebut = control.get('dateDebut')?.value;
    const dateFin = control.get('dateFin')?.value;
    if (dateDebut && dateFin && new Date(dateDebut) >= new Date(dateFin)) {
      control.get('dateFin')?.setErrors({ dateInvalid: true });
      return { dateInvalid: true };
    }
    return null;
  }

  submitForm(): void {
    this.submitted = true;

    if (this.promoForm.invalid || this.selectedBeneficiaires.length === 0) {
      Object.keys(this.promoForm.controls).forEach((key) => {
        console.log(key, this.promoForm.get(key)?.errors);
      });
      return;
    }

    const emetteur = this.promoForm.value.emetteur as IDistributeur;

    const promoTemp: Promo = {
      id: this.promo ? this.promo.id : uuidv4(),
      emetteur: emetteur,
      dateDebut: this.promoForm.value.dateDebut,
      dateFin: this.promoForm.value.dateFin,
      codeUnique: this.promoForm.value.code,
      montantRemise:
        this.selectedOption === 'Montant' ? this.promoForm.value.montant : 0,
      pourcentageRemise:
        this.selectedOption === 'Pourcentage'
          ? this.promoForm.value.pourcentage
          : 0,
      dateCreation: this.promo ? this.promo.dateCreation : new Date(),
      famille: [],
      ressource: [],
    };

    this.selectedBeneficiaires.forEach((beneficiaire) => {
      if ((beneficiaire as IFamille).description !== undefined) {
        promoTemp.famille!.push(beneficiaire as IFamille);
      } else if ((beneficiaire as IRessource).quantite !== undefined) {
        promoTemp.ressource!.push(beneficiaire as IRessource);
      }
    });

    this.promoService.ajouterPromo(promoTemp).subscribe(
      () => {
        this.router.navigate(['/list-promo']);
      },
      (error) => {
        console.error('Error saving promo:', error);
      }
    );
  }

  return(): void {
    this.router.navigate(['/list-promo']);
  }

  resetForm(): void {
    this.promoForm.reset();
    this.selectedOption = 'Montant';
    this.selectedBeneficiaires = [];
  }

  removeBeneficiaire(beneficiaire: IFamille | IRessource): void {
    const index = this.selectedBeneficiaires.indexOf(beneficiaire);
    if (index >= 0) {
      this.selectedBeneficiaires.splice(index, 1);
    }
  }

  onBeneficiaireSelected(event: MatAutocompleteSelectedEvent): void {
    const beneficiaire = event.option.value as IFamille | IRessource;
    this.selectedBeneficiaires.push(beneficiaire);
    this.promoForm.patchValue({ beneficiaire: '' });
  }

  onOptionChange(event: any): void {
    this.selectedOption = event.target.value;
  }
}

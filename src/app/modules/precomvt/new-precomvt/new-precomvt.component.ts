import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { elementAt, EMPTY, map, Observable, single } from 'rxjs';

import { PrecoMvtsService } from 'src/app/services/precomvts/precomvts.service';
import { IPrecoMvt } from 'src/app/modele/precomvt';
import { IRessource } from 'src/app/modele/ressource';
import { IFamille } from 'src/app/modele/famille';
import { RessourcesService } from 'src/app/services/ressources/ressources.service';
import { FamillesService } from 'src/app/services/familles/familles.service';
import { IPrecoMvtQte } from 'src/app/modele/precomvtqte';
import { TypeMvt } from 'src/app/modele/type-mvt';
import { IDistributeur } from 'src/app/modele/distributeur';
import { DistributeursService } from 'src/app/services/distributeurs/distributeurs.service';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';

@Component({
  selector: 'app-new-precomvt',
  templateUrl: './new-precomvt.component.html',
  styleUrls: ['./new-precomvt.component.scss'],
})
export class NewPrecomvtComponent implements OnInit {
  LIBELLE_PRECO = 'Libelle : ';
  forme: FormGroup;
  submitted: boolean = false;
  //permet d'identifier la section du formulaire à ouvrir
  steps: any = 1;

  filteredOptions: IRessource[] | undefined;
  distributeurs$: Observable<IDistributeur[]> = EMPTY;
  familles$: Observable<IFamille[]> = EMPTY;
  typeMvt: string[] = [];

  //représente l'ensemble des éléments de précoMvtQte en cours de création
  eltsPreco: IPrecoMvt[] = [];
  eltsPrecoMvtQte: IPrecoMvtQte[] = [];
  //précise l'index de eltPreco qu'on souhaite modifier
  indexModification = -1;

  idPrecoMvt: string = '';

  //submitted=false;
  tabError: Map<String, String> = new Map();
  passStep2: boolean = false;
  passStep3: boolean = false;
  @ViewChild(FormGroupDirective)
  formDirective!: FormGroupDirective;
  titre: string = '';
  btnLibelle: string = 'Ajouter';
  constructor(
    private formBuilder: FormBuilder,
    private serviceFamille: FamillesService,
    private dataEnteteMenuService: DonneesEchangeService,
    private serviceDistributeur: DistributeursService,
    private precoMvtService: PrecoMvtsService,
    private serviceRessource: RessourcesService,
    private router: Router,
    private infosPath: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    const storedStep = sessionStorage.getItem('Etape courante');
    if (storedStep) {
      this.steps = parseInt(storedStep);
    }
    const storedEltPreco = sessionStorage.getItem('Preco');
    if (storedEltPreco) {
      this.eltsPreco = JSON.parse(storedEltPreco);
    }
    this.forme = this.formBuilder.group({
      id: new FormControl(),
      libelle: new FormControl(),
      type: new FormControl(),
      etat: new FormControl(),
      ressource: new FormControl<string | IRessource>(''),
      quantiteMin: new FormControl(),
      quantiteMax: new FormControl(),
      montantMin: new FormControl(),
      montantMax: new FormControl(),
      famille: new FormControl<string | IFamille[]>(''),
      distributeur: new FormControl<string | IDistributeur[]>(''),
    });
    this.dataEnteteMenuService.getTypeMvt().subscribe((x) => {
      this.typeMvt = x.type;
    });
  }

  ngOnInit(): void {
    this.familles$ = this.getAllFamilles();
    this.distributeurs$ = this.getAllDistributeurs();
    this.serviceRessource.getAllRessources().subscribe((reponse) => {
      this.filteredOptions = reponse;
    });

    //code autocompletion qui retourne les éléments du type déclaré
    this.forme.controls['ressource'].valueChanges.subscribe((value) => {
      const libelle = typeof value === 'string' ? value : value?.libelle;
      if (libelle != undefined && libelle?.length > 0) {
        this.serviceRessource
          .getRessourcesByLibelle(libelle.toLowerCase() as string)
          .subscribe((reponse) => {
            this.filteredOptions = reponse;
          });
      } else {
        this.serviceRessource.getAllRessources().subscribe((reponse) => {
          this.filteredOptions = reponse;
        });
      }
    });
    let idPrecoMvt = this.infosPath.snapshot.paramMap.get('idPrecoMvt');
    if (idPrecoMvt != null && idPrecoMvt !== '') {
      this.precoMvtService
        .getPrecomvtById(idPrecoMvt)
        .subscribe((PrecoMvtCourant) => {
          //premier elt du tableau
          this.eltsPreco = [];

          let premvtqte: IPrecoMvtQte = {
            ressource: undefined,
            quantiteMax: 0,
            quantiteMin: 0,
            montantMax: 0,
            montantMin: 0,
            id: '',
            distributeur: [],
          };
          let precoMvtTemp: IPrecoMvt = {
            id: PrecoMvtCourant.id,
            etat: PrecoMvtCourant.etat,
            libelle: this.LIBELLE_PRECO + PrecoMvtCourant.libelle,
            type: PrecoMvtCourant.type,
            precomvtqte: [],
          };

          precoMvtTemp.precomvtqte.push(premvtqte);
          this.eltsPreco.push(precoMvtTemp);
          this.saveToSessionStorage();

          PrecoMvtCourant.precomvtqte.forEach((element) => {
            let precoMvtTemp: IPrecoMvt = {
              id: '',
              libelle: '',
              etat: true,
              type: '',
              precomvtqte: [],
            };

            precoMvtTemp.precomvtqte.push(element);
            if (element.ressource != undefined && element.ressource != null) {
              let rsrce = ' Ressource :  ';
              const ressource = element.ressource!.libelle;
              rsrce = rsrce + ressource;

              precoMvtTemp.libelle = rsrce;
              this.eltsPreco.push(precoMvtTemp);
              this.saveToSessionStorage();
            } else if (element.famille != null && element.famille.length > 0) {
              precoMvtTemp.libelle = this.mettre3PointsdeSuspension(
                element.famille
              );
              this.eltsPreco.push(precoMvtTemp);
              this.saveToSessionStorage();
            }
          });
        });
    }
    this.titre = this.dataEnteteMenuService.dataEnteteMenu;
  }

  get formeControls(): any {
    return this.forme['controls'];
  }

  get f() {
    return this.forme.controls;
  }

  private getAllFamilles() {
    return this.serviceFamille.getAllFamilles();
  }

  private getAllDistributeurs() {
    return this.serviceDistributeur.getAllDistributeurs();
  }
  /**
 *methode qui nous retient sur l'interface 1 si elle n'est pas enregistrée dans
 le tableau de droite
 * @param numbre valeur qui va etre affecté à la variable steps
 * pour pouvoir basculé sur l'interface 2 ou 3
 *
 */
  blocklibelle(numbre: number) {
    if (this.steps != 1) {
      this.steps = numbre;
    }
    this.saveStepToSession();
  }
  /**
   *
   */
  enregistrerPreco() {
    if (this.eltsPreco.length === 0) {
      alert('vous devez enregistrer au moins une ressource ou une famille');
      return;
    }

    let precomvtTemp: IPrecoMvt = {
      id: this.eltsPreco[0].id,
      etat: this.eltsPreco[0].etat,
      libelle: this.eltsPreco[0].libelle.replace(this.LIBELLE_PRECO, ''),
      type: this.eltsPreco[0].type,
      precomvtqte: [],
    };
    this.saveToSessionStorage();

    if (this.eltsPreco[0].id != null && this.eltsPreco[0].id != '')
      precomvtTemp.id = this.eltsPreco[0].id;
    this.eltsPreco.forEach((valeur) => {
      precomvtTemp.precomvtqte.push(valeur.precomvtqte[0]);
    });
    if (precomvtTemp.precomvtqte.length > 1) {
      this.precoMvtService.ajouterPrecomvt(precomvtTemp).subscribe((object) => {
        this.router.navigate(['list-precomvts']);
      });
    } else
      alert('vous devez enregistrer au moins une ressource ou une famille');
  }
  //fonction onSubmit fin

  //début fonction afficher message d'erreur
  validerControleStep(etape: number, valeurs: any) {
    let controleVerif = true;
    //controle sur l'étape courante
    if (this.steps == 1) {
      let valLibelle: string = this.forme.controls['libelle'].value;
      let valLibel = valLibelle;
      if (valLibelle != null && valLibelle.length > 0)
        valLibel = valLibelle.trimStart().trimEnd();
      if (valLibel == null || valLibel == '' || valLibel.length < 2) {
        controleVerif = false;
        this.tabError.set('libelle', 'Taille doit etre supérieure à 2');
      }
      let valType: string = this.forme.controls['type'].value;
      //let valType = valType.trimStart().trimEnd();
      if (valType == null || valType == '') {
        controleVerif = false;
        this.tabError.set('type', 'Le type doit avoir une valeur');
      }
      this.saveToSessionStorage();
    } else {
      if (this.steps == 2) {
        let valFamille: string[] = this.forme.controls['famille'].value;
        if (valFamille == null || valFamille.length == 0) {
          controleVerif = false;
          this.tabError.set(
            'famille',
            'Une famille au moins doit être selectionnée'
          );
        }
        this.saveToSessionStorage();
      } else if (this.steps == 3) {
        let valRessource: string = this.forme.controls['ressource'].value;

        if (
          valRessource == null ||
          valRessource == '' ||
          valRessource.length < 0
        ) {
          controleVerif = false;
          this.tabError.set('ressource', 'Une ressource est obligatoire');
        }
        this.saveToSessionStorage();
      }
      //controle commun ie montantMin et MontantMax
      if (this.steps == 2 || this.steps == 3) {
        let valMontantMin: number = this.forme.controls['montantMin'].value;

        if (valMontantMin == null || valMontantMin < 0) {
          controleVerif = false;
          this.tabError.set('montantMin', 'Montant Min est obligatoire');
        }
        let valMontantMax: number = this.forme.controls['montantMax'].value;

        if (valMontantMax == null || valMontantMax < 0) {
          controleVerif = false;
          this.tabError.set('montantMax', 'Montant Max est  obligatoire');
        }
        if (valMontantMin > valMontantMax) {
          controleVerif = false;
          this.tabError.set(
            'montantMinMax',
            'Montant Max doit être supérieur au montant Min'
          );
        }

        let valQuantiteMin: number = this.forme.controls['quantiteMin'].value;

        if (valQuantiteMin == null || valQuantiteMin < 0) {
          controleVerif = false;
          this.tabError.set('quantiteMin', 'Quantite Min est obligatoire');
        }

        let valQuantiteMax: number = this.forme.controls['quantiteMax'].value;

        if (valQuantiteMax == null || valQuantiteMax < 0) {
          controleVerif = false;
          this.tabError.set('quantiteMax', 'Quantite Max est obligatoire');
        }
        if (valQuantiteMin > valQuantiteMax) {
          controleVerif = false;
          this.tabError.set(
            'quantiteMinMax',
            'Quantite Max doit être supérieur à Quantite Min'
          );
        }
      }
    }
    if (controleVerif) {
      this.steps = etape;
      this.enregistrerValeurPrecomvtqte(valeurs);
    }
    this.saveStepToSession();
  }
  //début fonction afficher message d'erreur

  //Suppression d'un element dans le boitier début
  supprimerElt(element: IPrecoMvt) {
    this.eltsPreco.forEach((value, index) => {
      if (value == element) this.eltsPreco.splice(index, 1);
    });
    this.saveToSessionStorage();
  }
  //Suppression d'un element dans le boitier fin

  displayFn(ressource: IRessource): string {
    return ressource && ressource.libelle ? ressource.libelle : '';
  }

  reset(): void {
    this.forme.reset();
    //reset de l'index pour laisser le choix à l'utilisateur de remplir des nouvelles precoMvtQte
    this.indexModification = -1;
  }

  /**
   * Permet de sauvegarder l'enchainement des precoMvtQte chacune dans une precoMvt
   * @param precomvtqteInput
   * @returns
   */
  enregistrerValeurPrecomvtqte(precomvtInput: any) {
    //sauvegarde des valeurs de precoMvt <=> premier ecran
    if (precomvtInput.libelle != null && precomvtInput.libelle != '') {
      if (this.indexModification == -1)
        //si vaut -1 alors création
        this.eltsPreco.push(this.creerPrecoMvtQteLibelle(precomvtInput));
      //si différent de -1 alors modification
      else
        this.eltsPreco[this.indexModification] =
          this.creerPrecoMvtQteLibelle(precomvtInput);
    } else if (
      precomvtInput.ressource != null &&
      precomvtInput.ressource != ''
    ) {
      if (this.indexModification == -1)
        this.eltsPreco.push(this.creerPrecoMvtQteRessource(precomvtInput));
      else
        this.eltsPreco[this.indexModification] =
          this.creerPrecoMvtQteRessource(precomvtInput);
    } else if (
      precomvtInput.famille != null &&
      precomvtInput.famille.length > 0
    ) {
      if (this.indexModification == -1)
        this.eltsPreco.push(this.creerPrecoMvtQteFamille(precomvtInput));
      else
        this.eltsPreco[this.indexModification] =
          this.creerPrecoMvtQteFamille(precomvtInput);
    }

    this.reset();
    this.saveToSessionStorage();
  } //fonction valPrecomvtqte fin

  /**
   * retrouve l'index du tableau eltPreco pour l'afficher dans la partie gauche
   * @param i
   */
  chargerValeurPrecoMvt(i: number): void {
    //on reset pour éviter d'écraser les autres step car on teste l'existence du libelle
    this.reset();

    this.indexModification = i;
    let precoTmp = this.eltsPreco[i];
    //l'index 0 correspond toujours au premier écran de precoMvt
    if (i == 0) {
      this.steps = 1;
      this.forme.controls['libelle'].setValue(
        precoTmp.libelle.replace(this.LIBELLE_PRECO, '')
      );
      this.forme.controls['type'].setValue(precoTmp.type);
      this.forme.controls['etat'].setValue(precoTmp.etat);
      //ajouter un unique champ caché id pour conserver l'id en cas modification
      this.forme.controls['id'].setValue(precoTmp.id);
    }
    //si ressource absente de précoMvtQt alors par élimitation c'est une famille
    else if (
      precoTmp.precomvtqte[0].ressource != undefined &&
      precoTmp.precomvtqte[0].ressource != null
    ) {
      this.steps = 3;
      this.forme.controls['ressource'].setValue(
        precoTmp.precomvtqte[0].ressource
      );
      this.forme.controls['id'].setValue(precoTmp.precomvtqte[0].id);
      this.forme.controls['montantMax'].setValue(
        precoTmp.precomvtqte[0].montantMax
      );
      this.forme.controls['montantMin'].setValue(
        precoTmp.precomvtqte[0].montantMin
      );
      this.forme.controls['quantiteMax'].setValue(
        precoTmp.precomvtqte[0].quantiteMax
      );
      this.forme.controls['quantiteMin'].setValue(
        precoTmp.precomvtqte[0].quantiteMin
      );
      this.forme.controls['distributeur'].setValue(
        precoTmp.precomvtqte[0].distributeur
      );
    } else if (
      precoTmp.precomvtqte[0].famille != undefined &&
      precoTmp.precomvtqte[0].famille != null &&
      precoTmp.precomvtqte[0].famille.length > 0
    ) {
      this.steps = 2;
      this.forme.controls['famille'].setValue(precoTmp.precomvtqte[0].famille);
      //this.famille.setValue(precoTmp.precomvtqte[0].famille);
      this.forme.controls['id'].setValue(precoTmp.precomvtqte[0].id);
      this.forme.controls['montantMax'].setValue(
        precoTmp.precomvtqte[0].montantMax
      );
      this.forme.controls['montantMin'].setValue(
        precoTmp.precomvtqte[0].montantMin
      );
      this.forme.controls['quantiteMax'].setValue(
        precoTmp.precomvtqte[0].quantiteMax
      );
      this.forme.controls['quantiteMin'].setValue(
        precoTmp.precomvtqte[0].quantiteMin
      );
      this.forme.controls['distributeur'].setValue(
        precoTmp.precomvtqte[0].distributeur
      );
    }
    this.saveToSessionStorage();
  }

  /**
   * a partir des inputs html on crée un occurrence de PrecoMvt
   * @param precomvtInput
   * @returns
   */
  creerPrecoMvtQteFamille(precomvtInput: any): IPrecoMvt {
    let premvtqte: IPrecoMvtQte = {
      famille: precomvtInput.famille,
      quantiteMax: precomvtInput.quantiteMax,
      quantiteMin: precomvtInput.quantiteMin,
      montantMax: precomvtInput.montantMax,
      montantMin: precomvtInput.montantMin,
      id: '',
      distributeur: precomvtInput.distributeur,
    };
    let libel = this.mettre3PointsdeSuspension(precomvtInput.famille);
    let precomvtTemp: IPrecoMvt = {
      id: uuidv4(),
      etat: precomvtInput.etat,
      libelle: libel,
      type: precomvtInput.TypeMvt,
      precomvtqte: [],
    };
    precomvtTemp.precomvtqte.push(premvtqte);
    return precomvtTemp;
  }

  /**
   * pour le libelle de la famille, sil est trop long mettre 3 point de suspension
   */
  mettre3PointsdeSuspension(tableauFamille: any): string {
    this.saveToSessionStorage();
    let libel = 'Familles : ';
    for (let index = 0; index < tableauFamille!.length; index++) {
      libel += tableauFamille![index].libelle + ', ';
    }
    libel = libel.substring(0, libel.length - 2);
    if (libel.length > 30) {
      libel = libel.substring(0, 30);
      libel = libel + '...';
    }
    return libel;
  }
  saveToSessionStorage(): void {
    // stocker eltsPreco dans sessionStorage
    sessionStorage.setItem('Preco', JSON.stringify(this.eltsPreco));
  }
  saveStepToSession(): void {
    sessionStorage.setItem('Etape courante', this.steps.toString());
  }

  /**
   * a partir des inputs html on crée un occurrence de PrecoMvt
   * uniquement pour le cas des ressources
   * @param precomvtInput
   * @returns
   */
  creerPrecoMvtQteRessource(precomvtInput: any): IPrecoMvt {
    let premvtqte: IPrecoMvtQte = {
      ressource: precomvtInput.ressource,
      quantiteMax: precomvtInput.quantiteMax,
      quantiteMin: precomvtInput.quantiteMin,
      montantMax: precomvtInput.montantMax,
      montantMin: precomvtInput.montantMin,
      id: precomvtInput.id,
      distributeur: precomvtInput.distributeur,
    };
    let precomvtTemp: IPrecoMvt = {
      id: precomvtInput.id,
      etat: precomvtInput.etat,
      libelle: 'Ressource : ' + precomvtInput.ressource.libelle,
      type: precomvtInput.TypeMvt,
      precomvtqte: [],
    };
    precomvtTemp.precomvtqte.push(premvtqte);
    return precomvtTemp;
  }

  /**
   * a partir des inputs html on crée un occurrence de PrecoMvt
   * uniquement pour le step 1 (premier ecran)
   * @param precomvtInput
   * @returns
   */
  creerPrecoMvtQteLibelle(precomvtInput: any): IPrecoMvt {
    let premvtqte: IPrecoMvtQte = {
      ressource: undefined,
      quantiteMax: 0,
      quantiteMin: 0,
      montantMax: 0,
      montantMin: 0,
      id: precomvtInput.id,
      distributeur: precomvtInput.distributeur,
    };
    let idModif = uuidv4();
    if (precomvtInput.id !== null) idModif = precomvtInput.id;
    let precomvtTemp: IPrecoMvt = {
      id: idModif,
      etat: precomvtInput.etat,
      libelle: this.LIBELLE_PRECO + precomvtInput.libelle,
      type: precomvtInput.type,
      precomvtqte: [],
    };
    precomvtTemp.precomvtqte.push(premvtqte);
    return precomvtTemp;
  }
  compareItem(famille1: IFamille, famille2: IFamille) {
    return famille2 && famille1
      ? famille2.id === famille1.id
      : famille2 === famille1;
  }
  compareItem1(distributeur1: IDistributeur, distributeur2: IDistributeur) {
    return distributeur2 && distributeur1
      ? distributeur2.id === distributeur1.id
      : distributeur2 === distributeur1;
  }
  ngOnDestroy(): void {
    // Reset le sessionStorage
    sessionStorage.removeItem('Preco');
    sessionStorage.removeItem('Etape courante');
  }
  onReturn() {
    this.router.navigate(['/list-precomvts']);
  }
}

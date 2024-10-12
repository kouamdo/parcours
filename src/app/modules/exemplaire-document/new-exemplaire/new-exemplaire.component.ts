import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { IAssociationCategorieAttributs } from 'src/app/modele/association-categorie-attributs';
import { IAttributs } from 'src/app/modele/attributs';
import { IDistributeur } from 'src/app/modele/distributeur';
import { IDocument } from 'src/app/modele/document';
import { IExemplaireDocument } from 'src/app/modele/exemplaire-document';
import { IMouvement } from 'src/app/modele/mouvement';
import { ObjetCleValeur } from 'src/app/modele/objet-cle-valeur';
import { IPrecoMvt } from 'src/app/modele/precomvt';
import { IRessource } from 'src/app/modele/ressource';
import { IType } from 'src/app/modele/type';
import { DistributeursService } from 'src/app/services/distributeurs/distributeurs.service';
import { DocumentService } from 'src/app/services/documents/document.service';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { ExemplaireDocumentService } from 'src/app/services/exemplaire-document/exemplaire-document.service';
import { RessourcesService } from 'src/app/services/ressources/ressources.service';
import { v4 as uuidv4 } from 'uuid';
import { TypeMouvement } from 'src/app/modele/typeMouvement';
import { ModalCodebarreService } from '../../shared/modal-codebarre/modal-codebarre.service';
import { PatientsService } from 'src/app/services/patients/patients.service';
import { IPatient } from 'src/app/modele/Patient';
import { IMouvementCaisses, MoyenPaiement } from 'src/app/modele/mouvement-caisses';
import { ICaisses } from 'src/app/modele/caisses';
import { IComptes } from 'src/app/modele/comptes';
import { MouvementCaisseService } from 'src/app/services/mouvement-caisse/mouvement-caisse.service';
import { ComptesService } from 'src/app/services/comptes/comptes.service';
import { CaissesService } from 'src/app/services/caisses/caisses.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalMouvementCaisseComponent } from '../../shared/modal-mouvement-caisse/modal-mouvement-caisse.component';

@Component({
  selector: 'app-new-exemplaire',
  templateUrl: './new-exemplaire.component.html',
  styleUrls: ['./new-exemplaire.component.scss'],
})
export class NewExemplaireComponent implements OnInit {
  exemplaire: IExemplaireDocument = {
    id: '',
    idDocument: '',
    titre: '',
    description: '',
    etat: false,
    missions: [],
    attributs: [],
    objetEnregistre: [],
    categories: [],
    preconisations: [],
    mouvements: [],
    affichagePrix: false,
    estEncaissable: false,
    contientRessources: false,
    contientDistributeurs: false,
    typeMouvement: 'Neutre',
    docEtats: [],
    ordreEtats: [],
    dateCreation: new Date(),
    personneRattachee: {
      id: '',
      nom: '',
      adresse: '',
      mail: '',
      telephone: '',
      qrCodeValue: ''
    }
  };

  document: IDocument = {
    id: '',
    titre: '',
    description: '',
    etat: false,
    missions: [],
    attributs: [],
    categories: [],
    preconisations: [],
    affichagePrix: false,
    estEncaissable: false,
    contientRessources: false,
    contientDistributeurs: false,
    typeMouvement: 'Neutre',
    docEtats: []
  };

  attribut: IAttributs = {
    id: '',
    titre: '',
    description: '',
    etat: false,
    dateCreation: new Date(),
    dateModification: new Date(),
    valeursParDefaut: '',
    type: IType.Int,
  };

  formeExemplaire: FormGroup;
  btnLibelle: string = 'Ajouter';
  submitted: boolean = false;
  controlExemplaire = new FormControl();
  typeAttribut: string = '';
  idDocument: string | null = '';
  idExemplaire: string | null = '';
  idPatientCourant: string | null = '';
  nomPatientCourant: string | null = '';

  typeInt = IType.Int;
  typeString = IType.String;
  typeDouble = IType.Double;
  typeFloat = IType.Float;
  typeBoolean = IType.Boolean;
  typeDate = IType.Date;
  TypeBoolean = IType.Boolean;
  TypeRadio = IType.Radio;
  typeTextArea= IType.Textarea;

  compteur: number = -1;
  totalAttribut: number = 0;
  numerateur: number = -1;
  totalAttributSupprime: number = 0;
  objetCleValeurSupprime: ObjetCleValeur[] = [];
  tableauAttributsSupprime: IAttributs[] = [];

  tempAttributsCpt = new Map()
  tempAttributsObbligatoires = new Map()
  estValide : boolean = true
  eValvalide : string = "";
  titre:string='';  
  ressourceControl = new FormControl<string | IRessource>('');
  distributeurControl = new FormControl<string | IDistributeur>('');
  idRessource: string = '';
  ELEMENTS_TABLE_MOUVEMENTS: IMouvement[] = [];
  LAST_ELEMENTS_TABLE_MOUVEMENTS: IMouvement[] = [];
  dataSourceMouvements = new MatTableDataSource<IMouvement>(
    this.ELEMENTS_TABLE_MOUVEMENTS
  );
  filteredOptionsRessource: IRessource[] | undefined;
  filteredDistributeurOptions: IDistributeur[] | undefined;
  displayedRessourcesColumns: string[] = [
    'actions',
    'libelle',
    'quantite',
    'unite',
    'description'
  ]; // structure du tableau presentant les Ressources
  ELEMENTS_TABLE_MOUVEMENTCAISSES: IMouvementCaisses[] = [];
  dataSourceMouvementcaisses = new MatTableDataSource<IMouvementCaisses>(
    this.ELEMENTS_TABLE_MOUVEMENTCAISSES
  );
  displayedMvtCaissesColumns: string[] = [
    'N° Compte',
    'Montant Réglé',
    'Moyen Paiement',
    'Reste'
  ];
  TABLE_PRECONISATION_RESSOURCES: IPrecoMvt[] = [];
  montantTotal : number = 0;
  soustotal : number = 0;
  resteAPayer: number = 0;
  tailleFirstMvts : number = 0;
  distributeur : IDistributeur | undefined;
  modificationDistributeurActive : boolean = false
  indexmodificationDistributeur : number = -1
  typeNeutre : string = TypeMouvement.Neutre
  typeAjout : string = TypeMouvement.Ajout
  typeReduire : string = TypeMouvement.Reduire
  laPersonneRattachee : IPatient | undefined 
  compte: IComptes | undefined
  caisses: ICaisses[] = []
  modalResult: MoyenPaiement[] = [];
  modalLastResult: MoyenPaiement[] = [];
  tableMvts: IMouvementCaisses[] = []

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private donneeEchangeService:DonneesEchangeService,
    private infosPath: ActivatedRoute,
    private serviceRessource: RessourcesService,
    private serviceDistributeur: DistributeursService,
    private serviceDocument: DocumentService,
    private _liveAnnouncer: LiveAnnouncer,
    private serviceExemplaire: ExemplaireDocumentService,
    private datePipe: DatePipe,
    private barService: ModalCodebarreService,
    private servicePatient: PatientsService,
    private mvtCaisseService: MouvementCaisseService,
    private compteService: ComptesService,
    private caisseService: CaissesService,
    private dialogDef : MatDialog 
  ) {
    this.formeExemplaire = this.formBuilder.group({
      _exemplaireDocument: new FormArray([]),
      _controlsSupprime: new FormArray([]),
      use: [false],
      montant: ['', [Validators.required]],
      moyenPaiement: new FormControl<string | ICaisses>(''),
      referencePaiement: ['', [Validators.required]]
    })
  }
  scan_val: any | undefined;

  ngOnInit(): void {
    console.log("info doc :", this.exemplaire, this.document);
    
    let idPersonne : string = this.donneeEchangeService.getExemplairePersonneRatachee()
    this.servicePatient.getPatientById(idPersonne).subscribe(
      patientTrouve =>{
        this.laPersonneRattachee =  patientTrouve;
        if (patientTrouve != undefined) {
          this.nomPatientCourant = this.laPersonneRattachee.nom + " " + this.laPersonneRattachee.prenom
          this.compteService.getCompteByUser(this.laPersonneRattachee.id).subscribe(
            account => {
              this.compte = account;
              console.log('compte personne rattaché :', this.compte); 
            }
          )
        }
        console.log("personne ratachée :", this.nomPatientCourant);  
      }
    )

    this.caisseService.getAllCaisses().subscribe(
      (reponse) =>{
        this.caisses=reponse
        console.log('all caisses :', this.caisses);
        
      }
    );

    this.barService.getCode().subscribe((dt) => {
      this.scan_val = dt;
      this.ressourceControl.setValue(this.scan_val); // Set the initial value in the search bar

      if (this.scan_val) {
        // If scan_val is set, perform a search to get the corresponding libelle
        this.serviceRessource
          .getRessourcesByScanBarCodeorLibelle(this.scan_val)
          .subscribe((response) => {
            this.filteredOptionsRessource = response;
          });
      }
    });
    this.serviceDistributeur.getAllDistributeurs().subscribe(
      (reponse) =>{
        this.filteredDistributeurOptions=reponse
      }
    )
    this.compteur = -1;

    // recuperation de l'id de l'exemplaire
    this.idExemplaire = this.infosPath.snapshot.paramMap.get('idExemplaire');

    // recuperation de l'id du document
    this.idDocument = this.infosPath.snapshot.paramMap.get('idDocument');

    this.initialiseFormExemplaire();
    this.titre=this.donneeEchangeService.dataEnteteMenu
    
    this.ressourceControl.valueChanges.subscribe((value) => {
      const query = value?.toString().toLowerCase(); // Convert to lower case for case-insensitive search
      if (query && query.length > 0) {
        // Search by name or ID
        this.serviceRessource
          .getRessourcesByScanBarCodeorLibelle(query)
          .subscribe((reponse) => {
            this.filteredOptionsRessource = reponse;
          });
      } else {
        this.filteredOptionsRessource = [];
      }
    });

    this.distributeurControl.valueChanges.subscribe((value) => {
      const raisonSocial =
        typeof value === 'string' ? value : value?.raisonSocial;
      if (raisonSocial != undefined && raisonSocial?.length > 0) {
        this.serviceDistributeur
          .getDistributeursByraisonSocial(raisonSocial.toLowerCase() as string)
          .subscribe((reponse) => {
            this.filteredDistributeurOptions = reponse;
          });
      } else {
        this.serviceDistributeur.getAllDistributeurs().subscribe((reponse) => {
          this.filteredDistributeurOptions = reponse;
        });
      }
    });
  }

  /**
   * Methode pour l'initialisation d'un control avec une valeur
   * @param valParDefaut valeur recuperer dans objetEnregistre et qui servira de valeur du control cree
   */
  addAttributs(valParDefaut: any, obligatoire: Boolean) {
    if (valParDefaut != '' && valParDefaut != 'PARCOURS_NOT_FOUND_404') {
      if (obligatoire == true) {
        this._exemplaireDocument.push(
          this.formBuilder.control(valParDefaut, Validators.required)
        );
      } else {
        this._exemplaireDocument.push(this.formBuilder.control(valParDefaut));
      }
    } else {
      if (obligatoire == true) {
        this._exemplaireDocument.push(
          this.formBuilder.control('', Validators.required)
        );
      } else {
        this._exemplaireDocument.push(this.formBuilder.control(''));
      }
    }
  }

  /**
   * Methode pour l'initialisation d'un control avec une valeur
   * @param valParDefaut valeur recuperer dans objetEnregistre et qui servira de valeur du control cree
   */
  ajouterDisabledAttributs(valParDefaut: any) {
    if (valParDefaut != '' && valParDefaut != 'PARCOURS_NOT_FOUND_404') {
      this._controlsSupprime.push(this.formBuilder.control(valParDefaut));
    } else this._controlsSupprime.push(this.formBuilder.control(''));
  }

  /**
   * methode permettant de rechercher les attributs absents dans le model de document/exemplaire
   * et les placer dans un tableau
   */
  rechercherAttributsAbsants() {
    this.objetCleValeurSupprime = [];

    for (
      let index = 0;
      index < this.exemplaire.objetEnregistre.length;
      index++
    ) {
      const keyVal = this.exemplaire.objetEnregistre[index];
      let flag: boolean = false;

      for (let index = 0; index < this.exemplaire.attributs.length; index++) {
        const attribut = this.exemplaire.attributs[index];
        if (keyVal.key.id == attribut.id) {
          flag = true;
          break;
        }
      }
      if (flag == false) {
        this.objetCleValeurSupprime.push(keyVal);
        this.totalAttributSupprime = this.objetCleValeurSupprime.length - 1;
      }
    }
  }

  openModalPaiementDialog(){

    const dialogRef = this.dialogDef.open(ModalMouvementCaisseComponent,
    {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      enterAnimationDuration:'1000ms',
      exitAnimationDuration:'1000ms',
      data:{donnee: this.modalResult}
    }
    )

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.modalResult = result.data;
        if (this.modalLastResult) {
          this.modalLastResult.forEach((element) => {
            if (element.montant) {
              this.resteAPayer += element.montant;
            }
          });
        }
        this.modalResult.forEach((element) => {
          if (element.montant) {
            this.resteApayer(element.montant);
          }
        });
        this.modalLastResult = result.data;
        console.log('result :', this.modalResult);
      }
    });
  }

  initialiseFormExemplaire() {
    if (this.idExemplaire != null && this.idExemplaire !== '') {
      this.btnLibelle = 'Modifier';
      this.titre = 'Document à Modifier';

      this.serviceExemplaire
        .getExemplaireDocumentById(this.idExemplaire)
        .subscribe((x) => {
          this.exemplaire = x;
          this.document = x;
                  
          if (this.exemplaire.mouvements != undefined) {
            this.ELEMENTS_TABLE_MOUVEMENTS = this.exemplaire.mouvements;            
          }
          this.dataSourceMouvements.data = this.ELEMENTS_TABLE_MOUVEMENTS;
          console.log('mvts :', this.dataSourceMouvements.data);

          this.LAST_ELEMENTS_TABLE_MOUVEMENTS = this.ELEMENTS_TABLE_MOUVEMENTS;
          this.tailleFirstMvts = this.ELEMENTS_TABLE_MOUVEMENTS.length;
          
          this.totalAttribut = x.attributs.length - 1;
          this.rechercherAttributsAbsants();
         //Bug du mocker apiMemory qui ne met pas à jour les données du document dans exemplaire
         //pour avoir la donnée fraiche on refait un appel à document
         //à supprimer lorsqu'on aura un vrai back connecté
          this.modifierMouvementExemplaire(x.idDocument)
          this.resteAPayer = this.sommeMontants()
          this.fCaisse['montant'].setValue(0)  
        });
    }
    if (this.idDocument != null && this.idDocument !== '') {
      this.serviceDocument
        .getDocumentById(this.idDocument)
        .subscribe((document) => {
          this.document = document;
          this.totalAttribut = document.attributs.length - 1;
          this.formerEnteteTableauMissions()
          this.concatMouvementsSousExemplaireDocument()
          this.resteAPayer = this.sommeMontants()
          this.fCaisse['montant'].setValue(0)  
        });
    }
  }

  lastValueMvt(value: IMouvement):boolean {
    let response = false;
    this.LAST_ELEMENTS_TABLE_MOUVEMENTS = JSON.parse(localStorage.getItem("mvtExempl")!);
    if (this.LAST_ELEMENTS_TABLE_MOUVEMENTS != undefined) {
      let ele = this.LAST_ELEMENTS_TABLE_MOUVEMENTS.find((d) => d.id == value.id) as IMouvement;
      ele != undefined ? response = true : response = false;
      console.log("ele last table :", ele, response, this.LAST_ELEMENTS_TABLE_MOUVEMENTS);
    }
    return response;
  }

  useSolde(res: boolean):number {
    let reste: number = 0;
    if (res) {
      this.fCaisse['montant'].setValue(this.compte?.solde!);          
      reste = this.resteApayer(this.fCaisse['montant'].value);
    } else {
      reste = this.resteAPayer + this.fCaisse['montant'].value;
      this.fCaisse['montant'].setValue(0);          
    }
    return reste;
  }

  resteApayer(montant: number):number {
    this.resteAPayer -= montant;
    return this.resteAPayer;
  }

  /**
   * methode permettant de regrouper les mouvement des sous exemplaires pour
   * pré-former le tableau de mouvement
   */
  concatMouvementsSousExemplaireDocument(){
    let sousExelplaires : IExemplaireDocument[] = [];
    console.log("données echanges :", this.donneeEchangeService.dataDocumentSousDocuments, JSON.parse(localStorage.getItem("mvtExempl")!));
    
    if (this.donneeEchangeService.dataDocumentSousDocuments != undefined) {
      sousExelplaires = this.donneeEchangeService.dataDocumentSousDocuments;
      localStorage.setItem("mvtExempl", JSON.stringify(this.donneeEchangeService.dataDocumentSousDocuments));
    } else {
      sousExelplaires = JSON.parse(localStorage.getItem("mvtExempl")!);
    }
    if (sousExelplaires) {
      sousExelplaires.forEach(
        element => {
          if (element.mouvements) {
            element.mouvements!.forEach(
              mvt => {
                this.ELEMENTS_TABLE_MOUVEMENTS.push(mvt)
            });
          }     
      });
    }
    this.dataSourceMouvements.data = this.ELEMENTS_TABLE_MOUVEMENTS;
    this.tailleFirstMvts = this.ELEMENTS_TABLE_MOUVEMENTS.length;
    console.log(" taille table :", this.tailleFirstMvts, this.ELEMENTS_TABLE_MOUVEMENTS);
  }

/**
 * Methode permettant de former la nouvelle structure du tableau de mouvement de l'exemplaire
 * si les données affiche prix et affiche ressourse sont modifiées dans le document initial 
 * @param document est le model de document inital duquel l'exemplaire a été tiré
 */
  modifierMouvementExemplaire(idDocument:string){
    this.serviceDocument.getDocumentById(idDocument).subscribe(
      value=>{
        this.document.affichagePrix = value.affichagePrix
        this.document.contientRessources = value.contientRessources
        this.document.contientDistributeurs = value.contientDistributeurs
        this.document.typeMouvement = value.typeMouvement
        this.formerEnteteTableauMissions();
      })
  }

  /**
   * Methode qui permet de rajouter les colones de prix et montants si affichePrix a la valeur true
   */
  formerEnteteTableauMissions(){
    if (this.document.contientDistributeurs == true) {
      let distributeur : string = "distributeur"
      this.displayedRessourcesColumns.push(distributeur)
    }
    if ((this.document.affichagePrix == true)) {
      let prix : string = "prix"
      let montant : string = "montant total"
      if (this.document.typeMouvement == TypeMouvement.Reduire) {
        prix = "prixDeSortie"
      } else if (this.document.typeMouvement == TypeMouvement.Ajout){
        prix = "prixEntrée"
      }else{
        prix = "prix"
      }
      this.displayedRessourcesColumns.push(prix)
      this.displayedRessourcesColumns.push(montant)
    }
  }
  /**
   * methode permettant de renvoyer la valeur de l'attribut
   */
  rechercherValeurParIdAttribut(idAttribut: string): string {
    for (
      let index = 0;
      index < this.exemplaire.objetEnregistre.length;
      index++
    ) {
      const element = this.exemplaire.objetEnregistre[index];
      if (element.key.id == idAttribut) {
        return element.value;
      }
    }
    return 'PARCOURS_NOT_FOUND_404';
  }

  /**
   * methode permettant de renvoyer la valeur de l'attribut
   */
  rechercherValeurParIdAttributSupprime(idAttribut: string): string {
    for (let index = 0; index < this.objetCleValeurSupprime.length; index++) {
      const element = this.objetCleValeurSupprime[index];
      if (element.key.id == idAttribut) {
        return element.value;
      }
    }
    return 'PARCOURS_NOT_FOUND_404';
  }

  /**
   * Methode qui permet d'enregistrer les valeurs du formulaire dans un objet de type ObjetCleValeur
   * C'est set objet qui nous permettra de preremplir le formulaire lors de la modification
   */
  enregistrerObjet() {
    const exemplaireDocument = this._exemplaireDocument;
    this.exemplaire.objetEnregistre = [];
    this.document.attributs.forEach((a) => {
      const objetCleValeur: ObjetCleValeur = {
        key: '',
        value: '',
      };
      let index = this.tempAttributsCpt.get(a.id);
      objetCleValeur.key = a;
      objetCleValeur.value = exemplaireDocument.controls[index].value;
      this.exemplaire.objetEnregistre.push(objetCleValeur);
    });
  }
  /**
   * recuperation du formArray qui servira pour l'enregistrement des donnees
   */
  get _exemplaireDocument(): FormArray {
    return this.formeExemplaire.get('_exemplaireDocument') as FormArray;
  }

  /**
   * recuperation du formArray qui contiendra les controls qui ont ete supprime dans
   * le mpdel de document et existent encore dans exemplaire deje ennregistre
   */
  get _controlsSupprime(): FormArray {
    return this.formeExemplaire.get('_controlsSupprime') as FormArray;
  }

  /**
   * recuperation du formArray qui servira à initialiser les controls d'autocompletion des didtributeurs.
   */
  get _controlsAutocomplateDistributeur(): FormArray {
    return this.formeExemplaire.get(
      '_controlsAutocomplateDistributeur'
    ) as FormArray;
  }

  /**
   * Permet d'incrémenter les index des différents inputs contenus dans les formControl
   * ainsi que de les initialiser à une valeur par défaut
   * @param cpt valeur courante du compteur
   * @param idAttribut id attribut à afficher
   * @returns valeur courante + 1
   */
  incrementeCompteur(
    cpt: number,
    attributCategories: IAssociationCategorieAttributs
  ): number {
    if (this.compteur > -1 && this.compteur >= this.totalAttribut) {
      return cpt;
    }

    let valAttribut = this.rechercherValeurParIdAttribut(attributCategories.attribut.id);
    this.tempAttributsCpt.set(attributCategories.attribut.id, cpt+1)
    this.tempAttributsObbligatoires.set(cpt+1, attributCategories.attribut.titre)
    if (attributCategories.attribut.type == IType.Date && valAttribut != null) {
      // si le type de l'attribut est Date et que la valeur de valAttribut n'est pas vide
      let dateAtt = new Date();
      if(valAttribut != "PARCOURS_NOT_FOUND_404")
         dateAtt = new Date(valAttribut); // creatoion d'une nouvelle date avec la valeur de valAttribut

      let dateReduite = this.datePipe.transform(dateAtt, 'yyyy-MM-dd'); // changer le format de la date de naissance pour pouvoir l'afficher dans mon input type date
      this.addAttributs(dateReduite, attributCategories.obligatoire);
    } else {
      this.addAttributs(valAttribut, attributCategories.obligatoire);
    }
    this.compteur = this.compteur + 1;
    return this.compteur;
  }

  incrementeNumerateur(num: number, attribut: IAttributs): number {
    if (this.numerateur >= -1 && this.numerateur >= this.totalAttributSupprime)
      return num;

    let valAttribut = this.rechercherValeurParIdAttribut(attribut.id);
    if (attribut.type == IType.Date && valAttribut != null) {
      let date = new Date(valAttribut);
      let dateReduite = this.datePipe.transform(date, 'yyyy-MM-dd');
      this.ajouterDisabledAttributs(dateReduite);
    } else {
      this.ajouterDisabledAttributs(valAttribut);
    }
    this.numerateur = this.numerateur + 1;
    this._controlsSupprime.disable();
    return this.numerateur;
  }
  /**
   * Methode qui permet de parcourir le formulaire lors de la validation et de repérer les chapms obligatoires non remplis
   * @returns le titre du premier attribut obligatoire non remplis
   */
  evaluation():string{

    this.estValide = true
    for (let index = 0; index < this.tempAttributsObbligatoires.size; index++) {
      if (this.f.controls[index].errors) {
        this.estValide = false;
        this.eValvalide = this.tempAttributsObbligatoires.get(index);
        break;
      }
    }
    return this.eValvalide;
  }

  get f() {
    return this.formeExemplaire.get('_exemplaireDocument') as FormArray;
  }

  get fCaisse() {
    return this.formeExemplaire.controls;
  }

  /**
   * Methodr qui permet de faire la somme des montants du tableau de mouvements
   * pour afficher le resultat dans la case montant total
   */
  sommeMontants(): number {
    this.montantTotal = 0;
    this.ELEMENTS_TABLE_MOUVEMENTS.forEach((mouvement) => {
      if (
        mouvement.ressource != undefined &&
        mouvement.quantite != null &&
        mouvement.prix != null
      ) {
        this.montantTotal += mouvement.prix * mouvement.quantite;
      }
    });
    return this.montantTotal;
  }

  /**
   * methode de validation du formulaire (enregistrement des donnees du formulaire)
   */
  onSubmit(data: any) {
    const exemplaireDocument = this._exemplaireDocument;
    this.submitted = true;
    this.enregistrerObjet();
    this.evaluation();
    if (this.formeExemplaire.invalid) return;

    let exemplaireTemp: IExemplaireDocument = {
      id: uuidv4(),
      idDocument: this.document.id,
      titre: this.document.titre,
      description: this.document.description,
      missions: this.document.missions,
      attributs: this.document.attributs,
      estEncaissable: this.document.estEncaissable,
      objetEnregistre: this.exemplaire.objetEnregistre,
      categories: this.document.categories,
      preconisations: this.document.preconisations,
      mouvements: this.ELEMENTS_TABLE_MOUVEMENTS,
      etat: this.document.etat,
      affichagePrix: this.document.affichagePrix,
      contientRessources: this.document.contientRessources,
      contientDistributeurs: this.document.contientDistributeurs,
      typeMouvement: this.document.typeMouvement,
      docEtats: this.document.docEtats,
      ordreEtats: this.exemplaire.ordreEtats,
      dateCreation: new Date,
      personneRattachee: this.laPersonneRattachee!
    };

    if (this.exemplaire.id != '') {
      exemplaireTemp.id = this.exemplaire.id;
    }

    this.serviceExemplaire
      .ajouterExemplaireDocument(exemplaireTemp)
      .subscribe((object) => {
        console.log(" new exemplaire :", exemplaireTemp, data.value);
        this.saveMvt(data.value);
      });
  }

  displayFnCaisse(element: ICaisses): string {
    return element && element.libelle ? element.libelle : '';
  }

  saveMvt(selectItem: any) {
    let mvtCaisse: IMouvementCaisses[] = [];
    let donne : IMouvementCaisses;

    if (selectItem.moyenPaiement == 'multipaiement') {
      if (Array.isArray(this.modalResult)) {
        this.modalResult.forEach((element) => {
          if (element.montant) {
            donne = {
              id: uuidv4(),
              etat: selectItem.etat,
              montant: element.montant,
              libelle: selectItem.libelle,
              typeMvt: selectItem.typeMvt,
              dateCreation: new Date(),
              moyenPaiement: element.moyen,
              referencePaiement: element.reference,
              compte: this.compte,
              personnel: this.laPersonneRattachee!,
              exemplaire: this.exemplaire
            }
  
            mvtCaisse.push(donne);
          }
        });
        this.mvtCaisseService.ajouterMouvement(mvtCaisse).subscribe((obj) => {
          console.log('Le mouvement a été bien enregistré !', mvtCaisse);
          this.router.navigate(['/list-exemplaire']);
        })
      } else {
        console.error('modalResult is not an array:', this.modalResult);
      }    
    } else {
      let montant : number = 0;
      if (selectItem.use) {
        this.compte?.solde! < this.montantTotal ? montant = this.compte?.solde! : montant = this.montantTotal;
      }
      donne = {
        id: uuidv4(),
        etat: selectItem.etat,
        montant: selectItem.montant,
        libelle: selectItem.libelle,
        typeMvt: selectItem.typeMvt,
        dateCreation: new Date(),
        moyenPaiement: selectItem.moyenPaiement,
        referencePaiement: selectItem.referencePaiement,
        compte: this.compte,
        personnel: this.laPersonneRattachee!,
        exemplaire: this.exemplaire
      }

      this.mvtCaisseService.ajouterMouvement(donne).subscribe((obj) => {
        console.log('Le mouvement a été bien enregistré !', donne);
        this.router.navigate(['/list-exemplaire']);
      })
    }
  }

  /**
   * Methode permettant de récupérer un distributeur dans le template et de l'associer à 
   * une ressource avant de la mettre dans le tablau de mouvement
   * @param distributeur valeur du distributeur récupéré dans l'autocomplate distributeur sur le template
   */
  public associerDistributeur(distributeur: IDistributeur) {
    this.distributeur = distributeur;
  }
  public rechercherListingRessources(option: IRessource) {
    this.modificationDistributeurActive = false;
    this.indexmodificationDistributeur = -1;
    let tabIdRessource: string[] = [];
    this.ELEMENTS_TABLE_MOUVEMENTS.forEach((mouvement) => {
      if (
        mouvement.ressource.id == option.id &&
        mouvement.distributeur?.id == this.distributeur?.id
      ) {
        tabIdRessource.push(mouvement.ressource.id);
      }
    });
    if (!tabIdRessource.includes(option.id)) {
      let mvt: IMouvement = {
        id: '',
        description: '',
        quantite: option.quantite,
        prix: 0,
        dateCreation: new Date(),
        datePeremption:  new Date(),
        ressource: option
      }

      if (this.document.typeMouvement == TypeMouvement.Ajout) {
        mvt.prix = option.prixEntree
      }else if (this.document.typeMouvement == TypeMouvement.Reduire) {
        mvt.prix = option.prixDeSortie
      } else {
        mvt.prix = option.prixEntree
      }

      if (this.distributeurControl.value == undefined || this.distributeurControl.value == '') {
        this.distributeur = undefined
      }

      if(this.distributeur != undefined){
        mvt.distributeur = this.distributeur
      }

      this.ELEMENTS_TABLE_MOUVEMENTS.push(mvt)
      this.dataSourceMouvements.data = this.ELEMENTS_TABLE_MOUVEMENTS
    }
  }

  /**
   * Methode qui permet d'effacer la valeur du control ressource lorsqu'on a
   * déjà choisi la ressource en cliquant dessus
   */
  reinitialliseRessourceControl() {
    this.serviceRessource.getAllRessources().subscribe((resultat) => {
      this.filteredOptionsRessource = resultat;
    });
    this.ressourceControl.reset();
  }

  InitialiseDistributeurControlPourModufication(index : number){
    this.modificationDistributeurActive = true
    this.indexmodificationDistributeur = index
    let mouvement = this.ELEMENTS_TABLE_MOUVEMENTS[index]
    this.distributeurControl.setValue(mouvement.distributeur!)
  }

  modifierDistributeur() {
    if (
      this.modificationDistributeurActive == true &&
      this.indexmodificationDistributeur != -1
    ) {
      let mouvement =
        this.ELEMENTS_TABLE_MOUVEMENTS[this.indexmodificationDistributeur];
      mouvement.distributeur = this.distributeur;
      this.dataSourceMouvements.data = this.ELEMENTS_TABLE_MOUVEMENTS;
    }
    this.modificationDistributeurActive = false;
    this.indexmodificationDistributeur = -1;
  }

  displayFn(Ressource: IRessource): string {
    return Ressource && Ressource.libelle && Ressource.scanBarCode
      ? Ressource.libelle
      : '';
  }
  displayFnn(option: any): string {
    return option.scanBarCode ? option.scanBarCode : option.libelle;
  }

  displayDistributeurFn(distributeur: IDistributeur): string {
    return distributeur && distributeur.raisonSocial
      ? distributeur.raisonSocial
      : '';
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  getRessourceId(idRessource: string) {
    this.idRessource = idRessource;
  }

  retirerSelectionRessource(index: number) {
    this.ELEMENTS_TABLE_MOUVEMENTS = this.dataSourceMouvements.data;
    this.ELEMENTS_TABLE_MOUVEMENTS.splice(index, 1); // je supprime un seul element du tableau a la position 'index'
    this.dataSourceMouvements.data = this.ELEMENTS_TABLE_MOUVEMENTS;
  }
}

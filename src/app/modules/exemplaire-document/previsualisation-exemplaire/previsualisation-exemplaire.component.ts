import { LiveAnnouncer } from '@angular/cdk/a11y';
import { v4 as uuidv4 } from 'uuid';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { IExemplaireDocument } from 'src/app/modele/exemplaire-document';
import { IMouvement } from 'src/app/modele/mouvement';
import { IType } from 'src/app/modele/type';
import { TypeMouvement } from 'src/app/modele/typeMouvement';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { ExemplaireDocumentService } from 'src/app/services/exemplaire-document/exemplaire-document.service';
import { ModalChoixDocEtatComponent } from '../../shared/modal-choix-doc-etat/modal-choix-doc-etat.component';
import { IDocument } from 'src/app/modele/document';
import { DocumentService } from 'src/app/services/documents/document.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDocEtats } from 'src/app/modele/doc-etats';
import { PdfExemplaireGeneratorService } from 'src/app/services/pdfExemplaireGenerator/pdf-exemplaire-generator.service';

@Component({
  selector: 'app-previsualisation-exemplaire',
  templateUrl: './previsualisation-exemplaire.component.html',
  styleUrls: ['./previsualisation-exemplaire.component.scss']
})
export class PrevisualisationExemplaireComponent implements OnInit {

  nomPatientCourant: string | null = '';
  exemplaire : IExemplaireDocument = {
    id: '',
    titre: '',
    description: '',
    missions: [],
    attributs: [],
    idDocument: '',
    objetEnregistre: [],
    categories: [],
    preconisations: [],
    mouvements: [],
    etat: false,
    affichagePrix: false,
    contientRessources: false,
    contientDistributeurs: false,
    typeMouvement: TypeMouvement.Neutre,
    docEtats: [],
    dateCreation: new Date,
    personneRattachee: {
      id: '',
      nom: '',
      adresse: '',
      mail: '',
      telephone: '',
      qrCodeValue: ''
    },
    formatCode: '',
    code: '',
    beneficiaireObligatoire: true
  };
  titre:string='';
  mouvements : IMouvement[] = []
  typeNeutre : string = TypeMouvement.Neutre
  typeAjout : string = TypeMouvement.Ajout
  typeReduire : string = TypeMouvement.Reduire
  montantTotal: number = 0;
  displayedRessourcesColumns: string[] = [
    'libelle',
    'quantite',
    'unite',
    'description'
  ]; // structure du tableau presentant les Ressources
  dataSourceMouvements = new MatTableDataSource<IMouvement>();
  dataSourceAutresExemplaires = new MatTableDataSource<IExemplaireDocument>();
  filteredOptions: IExemplaireDocument[] | undefined;
  displayedColumns: string[] = ['titre'];
  @ViewChild(MatSort) sort!: MatSort;
  reponse: any;
  EtatsSuivant: any;
  selectedEtatsMap: any;
  TabOrdre: any;
  NextEtats: { id: any; ordre: number; etat: any; dateCreation: Date; } | undefined;
  ExempleOrdre: any;
  error!: string;
  courant: string = '';
  req: boolean = false;
  docEtatCourant : IDocEtats | undefined
  content : HTMLElement | undefined

  constructor(
    private router:Router, 
    public dialog: MatDialog,
    private infosPath:ActivatedRoute,
    private dataEnteteMenuService:DonneesEchangeService, 
    private serviceExemplaire:ExemplaireDocumentService,
    private datePipe: DatePipe,
    private serviceDocument: DocumentService,
    private serviceExemplaireDocument: ExemplaireDocumentService,
    private _liveAnnouncer: LiveAnnouncer,
    private decimalPipe : DecimalPipe,
    private servicePdfExemplaireGenerator : PdfExemplaireGeneratorService
    ) {}

  ngOnInit(): void {
    this.getAllExemplaires().subscribe(valeurs => {
      this.dataSourceAutresExemplaires.data = valeurs;
      this.filteredOptions = valeurs
    });

    let idExemplaire = this.infosPath.snapshot.paramMap.get('idExemplaire');
    if((idExemplaire != null) && idExemplaire!==''){
      this.serviceExemplaire
        .getExemplaireDocumentById(idExemplaire)
        .subscribe((x) => {
          this.exemplaire = x;
          if (this.exemplaire.personneRattachee != undefined) {
            this.nomPatientCourant = this.exemplaire.personneRattachee.nom + " " + this.exemplaire.personneRattachee.prenom!;
          }
          if (this.exemplaire.mouvements != undefined) {
            this.mouvements = this.exemplaire.mouvements
            this.dataSourceMouvements.data = this.exemplaire.mouvements
          }
          this.formerEnteteTableauMissions();
          this.serviceDocument.getDocumentById(x.idDocument).subscribe(
            (y) => {
              this.reponse = this.serviceExemplaire.getExemplaireDocumentByOrder(x, y);
              if (this.reponse) {
                this.req = this.reponse.sol;
                if (this.reponse.ele != undefined && this.reponse.ele.etat != undefined) {
                  this.courant = this.reponse.ele.etat.libelle;
                  this.rechercheDocEtatCourant(this.reponse.ele.etat.id)
                }
              }
            }
          )

          if (this.exemplaire.ordreEtats != undefined) {
            this.TabOrdre = this.exemplaire.ordreEtats;
          }
          if (this.exemplaire.mouvements != undefined) {
            this.mouvements = this.exemplaire.mouvements;
          }
        });
    }
    this.titre=this.dataEnteteMenuService.dataEnteteMenu
  }
/**
 * Methode permettant de formater les nombres afin d'y inserer un separateur de millers
 * @param nbr le nombre à transformer
 * @returns 
 */
  separateurDeMilliers(nbr:number) : string | null{
    return this.decimalPipe.transform(nbr)
  }

  /**
   * methode permettant de renvoyer la valeur de l'attribut
   */
  rechercherValeurParIdAttribut(idAttribut: string, typeAttribut: IType): string {
    for (
      let index = 0;
      index < this.exemplaire.objetEnregistre.length;
      index++
    ) {
      const element = this.exemplaire.objetEnregistre[index];
      if (element.key.id == idAttribut) {
        if (typeAttribut == IType.Date && element.value != undefined) {  // si le type de l'attribut est Date et que la valeur n'est pas vide
          let dateAtt = new Date();
          dateAtt = new Date(element.value); // creatoion d'une nouvelle date avec la valeur de valAttribut

          let dateReduite = this.datePipe.transform(dateAtt, 'dd-MM-yyyy'); // changer le format de la date de naissance pour pouvoir l'afficher dans mon input type date

          return dateReduite!
        }else if (element.value == undefined) {
          return "//"
        }
        return element.value;
      }
    }
    return '';
  }

  /**
   * Methode permettant de verifier si un attribut existe déjà dans les valeur enregistrées de l'exemplaire
   * afin de determiner s'il doit etre affiché dans la previsualisation 
   * @param idAttribut id de l'attribut à rechercher
   * @returns 
   */
  estEnregistrer(idAttribut : string) : boolean{
    let listIdAttrTemp : string[] = []
    this.exemplaire.objetEnregistre.forEach(element => {
      listIdAttrTemp.push(element.key.id)
    });
    if (!listIdAttrTemp.includes(idAttribut)) {
      return false
    }else
    return true

  }
  /**
   * Methodr qui permet de faire la somme des montants du tableau de mouvements
   * pour afficher le resultat dans la case montant total
   */
  sommeMontants(): number {
    this.montantTotal = 0;
    this.exemplaire.mouvements?.forEach((mouvement) => {
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
   * Methode qui permet de rajouter les colones de prix et montants si affichePrix a la valeur true
   */
  formerEnteteTableauMissions(){
    if (this.exemplaire.contientDistributeurs == true) {
      let distributeur : string = "distributeur"
      this.displayedRessourcesColumns.push(distributeur)
    }
    if ((this.exemplaire.affichagePrix == true)) {
      let prix : string = "prix"
      let montant : string = "montant total"
      if (this.exemplaire.typeMouvement == TypeMouvement.Reduire) {
        prix = "prixDeSortie"
      } else if (this.exemplaire.typeMouvement == TypeMouvement.Ajout){
        prix = "prixEntrée"
      }else{
        prix = "prix"
      }
      this.displayedRessourcesColumns.push(prix)
      this.displayedRessourcesColumns.push(montant)
    }
  }
  private getAllExemplaires(){
    return this.serviceExemplaireDocument.getAllExemplaireDocuments();
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  openModal(documentChoisi: IDocument) {
    let selectedEtat = {};

    if (this.reponse!.in != documentChoisi.docEtats.length - 1) {
      this.EtatsSuivant = documentChoisi.docEtats.slice(this.reponse!.in + 1);
      const dialogRef = this.dialog.open(ModalChoixDocEtatComponent, {
        width: '600px',
        data: {
          documentChoisi: documentChoisi,
          EtatsChoisi: this.EtatsSuivant,
          selectedEtat: selectedEtat,
        },
      });

      dialogRef.afterClosed().subscribe(
        () => {
          this.selectedEtatsMap = this.dataEnteteMenuService.dataEtatSelectionner;
          let ordre = 0;
          if (this.TabOrdre.length > 0) {
            ordre = this.TabOrdre[this.TabOrdre.length - 1].ordre;
          }

          this.NextEtats = {
            id: uuidv4(),
            ordre: ordre + 1,
            etat: this.selectedEtatsMap!.etat,
            dateCreation: new Date(),
          };

          this.TabOrdre.push(this.NextEtats);
          this.ExempleOrdre = this.TabOrdre;

          let exemplaireTemp: IExemplaireDocument = {
            id: uuidv4(),
            code: this.exemplaire.code,
            idDocument: this.exemplaire.id,
            titre: this.exemplaire.titre,
            description: this.exemplaire.description,
            missions: this.exemplaire.missions,
            attributs: this.exemplaire.attributs,
            objetEnregistre: this.exemplaire.objetEnregistre,
            categories: this.exemplaire.categories,
            preconisations: this.exemplaire.preconisations,
            mouvements: this.exemplaire.mouvements,
            etat: this.exemplaire.etat,
            affichagePrix: this.exemplaire.affichagePrix,
            contientRessources: this.exemplaire.contientRessources,
            contientDistributeurs: this.exemplaire.contientDistributeurs,
            typeMouvement: this.exemplaire.typeMouvement,
            ordreEtats: this.ExempleOrdre,
            docEtats: [],
            dateCreation: new Date(),
            personneRattachee: this.exemplaire.personneRattachee,
            formatCode: this.exemplaire.formatCode,
            beneficiaireObligatoire:  this.exemplaire.beneficiaireObligatoire
          };
          this.rechercheDocEtatCourant(this.NextEtats.etat.id)
          
          
          if (this.exemplaire.id != '') {
            exemplaireTemp.id = this.exemplaire.id;
          }
      
          this.serviceExemplaire
            .ajouterExemplaireDocument(exemplaireTemp)
            .subscribe((object) => {
              this.ngOnInit();
              this.router.navigateByUrl(this.router.url);
            });
        }
      );
    } else {
      this.error = 'état final aucune action possible !!';
    }
  }

  rechercheDocEtatCourant(idEtatCourant : string){
    this.exemplaire.docEtats.forEach(
      element => {
      
    });
    for (let index = 0; index < this.exemplaire.docEtats.length; index++) {
      const element = this.exemplaire.docEtats[index];

      if (element.etat.id == idEtatCourant) {
        this.docEtatCourant = element
      }
    }    
  }

  orderSuivant() {
    let exemplaireTemp: IExemplaireDocument = {
      id: uuidv4(),
      code: this.exemplaire.code,
      idDocument: this.exemplaire.id,
      titre: this.exemplaire.titre,
      description: this.exemplaire.description,
      missions: this.exemplaire.missions,
      attributs: this.exemplaire.attributs,
      objetEnregistre: this.exemplaire.objetEnregistre,
      categories: this.exemplaire.categories,
      preconisations: this.exemplaire.preconisations,
      mouvements: this.exemplaire.mouvements,
      etat: this.exemplaire.etat,
      affichagePrix: this.exemplaire.affichagePrix,
      contientRessources: this.exemplaire.contientRessources,
      contientDistributeurs: this.exemplaire.contientDistributeurs,
      typeMouvement: this.exemplaire.typeMouvement,
      ordreEtats: this.ExempleOrdre,
      docEtats: [],
      dateCreation: new Date(),
      personneRattachee: this.exemplaire.personneRattachee,
      formatCode: this.exemplaire.formatCode,
      beneficiaireObligatoire: true
    };

    if (this.exemplaire.id != '') {
      exemplaireTemp.id = this.exemplaire.id;
    }

    this.serviceExemplaire
      .ajouterExemplaireDocument(exemplaireTemp)
      .subscribe((object) => {
        this.router.navigateByUrl(this.router.url);
      });
  }
  pdfExemplaireGenerator(eltId: string){
    this.content = document.getElementById(eltId)!
    return this.servicePdfExemplaireGenerator.generatePdf(this.content)
  }
}
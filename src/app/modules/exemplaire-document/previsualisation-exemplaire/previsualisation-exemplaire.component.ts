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
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { IPatient } from 'src/app/modele/Patient';
import { ModalMouvementCaisseCompteComponent } from '../../shared/modal-mouvement-caisse-compte/modal-mouvement-caisse-compte.component';
import { float } from '@zxing/library/esm/customTypings';

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
    estEncaissable: false,
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
  sommeMontants(mouvements: IMouvement[]): number {
    this.montantTotal = 0;
    mouvements?.forEach((mouvement) => {
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

  /**
   * Methode permettant de rafraîchir la section de la page presentant l'emplaire et de 
   * remplacer ce dernier par le document de la personne sur lequel on clique pour le visualiser
   * @param exemplaire : document recupéré pour etre visualisé
   */
  switchExemplaires(exemplaire : IExemplaireDocument){
    this.displayedRessourcesColumns = [
      'libelle',
      'quantite',
      'unite',
      'description'
    ];
    this.exemplaire = exemplaire
    
    this.formerEnteteTableauMissions();

    if (this.exemplaire.mouvements != undefined) {
      this.mouvements = this.exemplaire.mouvements
    }
    if (this.exemplaire.mouvements != undefined) {
      this.dataSourceMouvements.data = this.exemplaire.mouvements
    }
    this.titre=this.dataEnteteMenuService.dataEnteteMenu
    this.nomPatientCourant = sessionStorage.getItem('nomPatientCourant');
  }

  openModalDialog(personnel: IPatient, montant: float, document: IExemplaireDocument){
    const dialogRef = this.dialog.open(ModalMouvementCaisseCompteComponent,
    {
      maxWidth: '100%',
      maxHeight: '100%',
      width:'100%',
      height:'100%',
      enterAnimationDuration:'1000ms',
      exitAnimationDuration:'1000ms',
      data:{personnel, montant, document}
    }
    )

    dialogRef.afterClosed().subscribe(result => { 
      console.log("result:", result);
    });   
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
            estEncaissable: this.exemplaire.estEncaissable,
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
    for (let index = 0; index < this.exemplaire.docEtats.length; index++) {
      const element = this.exemplaire.docEtats[index];

      if (element.etat.id == idEtatCourant) {
        this.docEtatCourant = element
        break
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
      estEncaissable: this.exemplaire.estEncaissable,
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
  
  /**
   * Méthode pour générer des instances de PDF où chaque PDF contient 
   * un sous-tableau de mouvements regroupés par distributeur existant
   */
  generatePDFsByDistributeur() {
    // Filtrer les mouvements pour ne conserver que ceux avec un distributeur
    const mouvementsAvecDistributeur = this.mouvements.filter(
      (mouvement) => mouvement.distributeur !== undefined
    );

    // Grouper les mouvements par distributeur
    const mouvementsParDistributeur = this.groupMouvementsByDistributeur(mouvementsAvecDistributeur);

    // Itérer sur chaque distributeur et générer un PDF
    Object.keys(mouvementsParDistributeur).forEach((distributeurId, index) => {
      const mouvements = mouvementsParDistributeur[distributeurId];
      const distributeurName = mouvements[0]?.distributeur?.raisonSocial || '';

      // Créez un conteneur temporaire pour le contenu de chaque PDF
      const container = document.createElement('div');
      container.innerHTML = `
        <div class="mainBlock" id="top2">
          <div id="globalSection">
            <div id="contentToPrint">
              <div class="entete">
                  <h3>Mouvements pour Distributeur : ${distributeurName}</h3>
              </div>
              <div class="infos">
                  <div id="titre">
                    <div *ngIf="this.exemplaire.personneRattachee != undefined">
                      <span class="label">
                        Nom du destinataire : 
                      </span>
                      <span class="title"> 
                        ${distributeurName}
                      </span>
                    </div>
                    <div>
                      <span class="label">
                           Fait le :
                      </span>
                      <span class="title"> ${this.formatDate(this.exemplaire.dateCreation)}
                      </span>
                      <span class="label">
                           à :
                      </span>
                      <span class="title"> ${this.formatDateTime(this.exemplaire.dateCreation)}
                      </span>
                    </div>
                    <div>
                        <span class="label"> Etat courant : </span>
                         ${ this.courant }
                    </div>
                    <div>
                        <span class="label"> code : </span>
                         ${ this.exemplaire.code }
                    </div>
                  </div>
                  <div class="block1" *ngFor="let attributParCategorie of exemplaire.categories">
                  
                    ${this.exemplaire.categories.map(attributParCategorie => `
                      <div class="pb-3" *ngIf="attributParCategorie.nom">
                        <h4> ${ attributParCategorie.nom }</h4>
                        <div class="contentBlock">
                          <div class="inputBlock" *ngFor="let attributParCategorie of attributParCategorie.listAttributsParCategories">
                          
                            ${attributParCategorie.listAttributsParCategories.map(attributParCategorie => `

                              <label class=""> ${ attributParCategorie.attribut.titre } :
                              </label>
                              <div class="valAttribut">
                                <span> ${
                                  this.rechercherValeurParIdAttribut(
                                  attributParCategorie.attribut.id,
                                  attributParCategorie.attribut.type
                                  )
                                  }
                                </span>
                              </div>
                            `).join('')}
                          </div>
                        </div>
                      </div>
                    `).join('')}
                  </div>
              </div>

              <!-- tableau listing des mouvements -->
              <div class="card-body p-0 tableBlock" id="tableBlock">
                  <div class='table-responsive w-100'>
                      <table class='table table-sm table-centered table-striped table-bordered w-100'>
                          <thead>
                              <tr>
                                  <th class="text-dark containHead">Libellé</th>
                                  <th class="text-dark containHead">Quantité</th>
                                  <th class="text-dark containHead">Unité</th>
                                  <th class="text-dark containHead">Description</th>
                                  <th class="text-dark containHead">Prix</th>
                                  <th class="text-dark containHead">Montant total</th>
                              </tr>
                          </thead>
                          <tbody>
                            ${mouvements.map(mouvement => `
                              <tr>
                                  <td>${mouvement.ressource.libelle}</td>
                                  <td>${this.separateurDeMilliers(mouvement.quantite)}</td>
                                  <td>${mouvement.ressource.unite}</td>
                                  <td>${mouvement.description}</td>
                                  <td>${this.separateurDeMilliers(mouvement.prix)}</td>
                                  <td>${this.separateurDeMilliers(mouvement.quantite * mouvement.prix)}</td>
                              </tr>
                            `).join('')}
                          </tbody>
                      </table>

                      <!-- montant total -->
                      <div class="total" *ngIf="mouvements.length">
                          <span class="mr-2">Montant Total : </span>
                          <input type="text" value="${this.separateurDeMilliers(this.sommeMontants(mouvements))}" disabled />
                      </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Ajoutez le conteneur au DOM pour permettre à `html2canvas` de capturer son contenu
      document.body.appendChild(container);

      // Génération du PDF à partir du contenu du conteneur
      html2canvas(container).then(canvas => {
        const imgWidth = 208;
        const pageHeight = 295;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        const contentDataURL = canvas.toDataURL('image/png');
        let pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);

        // Enregistrer le PDF avec un nom unique pour chaque distributeur
        pdf.save(`mouvements_distributeur_${distributeurName}_${index + 1}.pdf`);

        // Supprimez le conteneur temporaire du DOM
        document.body.removeChild(container);
      });
    });
  }

  /**
   * Méthode pour grouper les mouvements par distributeur
   */
  groupMouvementsByDistributeur(mouvements: IMouvement[]) {
    return mouvements.reduce((acc, mouvement) => {
      const distributeurId = mouvement.distributeur?.id || 'sans_distributeur';
      if (!acc[distributeurId]) {
        acc[distributeurId] = [];
      }
      acc[distributeurId].push(mouvement);
      return acc;
    }, {} as { [key: string]: IMouvement[] });
  }

  /**
   * Méthode pour formater les dates
   */
  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd-MM-yyyy') || '';
  } 
  formatDateTime(date: Date): string {
    return this.datePipe.transform(date, 'hh:mm:ss') || '';
  }  
}
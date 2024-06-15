import { Component, OnInit } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDocEtats } from 'src/app/modele/doc-etats';
import { IEtats } from 'src/app/modele/etats';
import { IExemplaireDocument } from 'src/app/modele/exemplaire-document';
import { IMouvement } from 'src/app/modele/mouvement';
import { TypeMouvement } from 'src/app/modele/typeMouvement';
import { DocumentService } from 'src/app/services/documents/document.service';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { ExemplaireDocumentService } from 'src/app/services/exemplaire-document/exemplaire-document.service';
import { IOrdreEtat } from 'src/app/modele/ordreEtat';
import { IDocument } from 'src/app/modele/document';
import { ModalChoixDocEtatComponent } from '../../shared/modal-choix-doc-etat/modal-choix-doc-etat.component';
import { log } from 'console';

@Component({
  selector: 'app-view-exemplaire',
  templateUrl: './view-exemplaire.component.html',
  styleUrls: ['./view-exemplaire.component.scss'],
})
export class ViewExemplaireComponent implements OnInit {
  exemplaire: IExemplaireDocument = {
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
    ordreEtats: [],
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
      qrCodeValue: '',
      mdp: ''
    }
  };
  titre: string = '';
  courant: string = '';
  req: boolean = false;
  error: string = '';
  selectedEtatsMap: IDocEtats | undefined;
  reponse: { ele: IOrdreEtat; sol: boolean; in: number } | undefined;
  mouvements: IMouvement[] = [];
  EtatsSuivant: IDocEtats[] = [];
  TabOrdre: IOrdreEtat[] = [];
  ExempleOrdre: IOrdreEtat[] = [];
  NextEtats!: IOrdreEtat;
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private infosPath: ActivatedRoute,
    private dataEnteteMenuService: DonneesEchangeService,
    private serviceDocument: DocumentService,
    private serviceExemplaire: ExemplaireDocumentService
  ) {}

  ngOnInit(): void {
    let idExemplaire = this.infosPath.snapshot.paramMap.get('idExemplaire');
    if (idExemplaire != null && idExemplaire !== '') {
      this.serviceExemplaire
        .getExemplaireDocumentById(idExemplaire)
        .subscribe((x) => {
          this.exemplaire = x;
          this.serviceDocument.getDocumentById(x.idDocument).subscribe(
            (y) => {
              this.reponse = this.serviceExemplaire.getExemplaireDocumentByOrder(x, y);
              if (this.reponse) {
                this.req = this.reponse.sol;
                this.courant = this.reponse.ele.etat.libelle;
              }
              console.log('element response :', this.serviceExemplaire.getExemplaireDocumentByOrder(x, y));
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
    this.titre = this.dataEnteteMenuService.dataEnteteMenu;
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

      dialogRef.componentInstance.saveChanges.subscribe(
        (selectedEtat: IDocEtats) => {
          this.selectedEtatsMap = selectedEtat;
          console.log('modal response :', this.selectedEtatsMap);
          let ordre = 0;
          if (this.TabOrdre.length > 0) {
            ordre = this.TabOrdre[this.TabOrdre.length - 1].ordre;
            console.log('taille tab :', this.TabOrdre.length);
          }

          this.NextEtats = {
            id: uuidv4(),
            ordre: ordre + 1,
            etat: this.selectedEtatsMap.etat,
            dateCreation: new Date(),
          };
          console.log('nouvelle ordre:', this.NextEtats);

          this.TabOrdre.push(this.NextEtats);
          this.ExempleOrdre = this.TabOrdre;

          let exemplaireTemp: IExemplaireDocument = {
            id: uuidv4(),
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
            personneRattachee: {
              id: '',
              nom: '',
              adresse: '',
              mail: '',
              telephone: '',
              qrCodeValue: '',
              mdp: ''
            }
          };
      
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

  orderSuivant() {
    let exemplaireTemp: IExemplaireDocument = {
      id: uuidv4(),
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
      personneRattachee: {
        id: '',
        nom: '',
        adresse: '',
        mail: '',
        telephone: '',
        qrCodeValue: '',
        mdp: ''
      }
    };

    if (this.exemplaire.id != '') {
      exemplaireTemp.id = this.exemplaire.id;
    }

    this.serviceExemplaire
      .ajouterExemplaireDocument(exemplaireTemp)
      .subscribe((object) => {
        this.router.navigateByUrl(this.router.url);
      });

    console.log('ordre etat :', exemplaireTemp);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { IDocEtats } from 'src/app/modele/doc-etats';
import { IExemplaireDocument } from 'src/app/modele/exemplaire-document';
import { IMouvement } from 'src/app/modele/mouvement';
import { TypeMouvement } from 'src/app/modele/typeMouvement';
import { DocumentService } from 'src/app/services/documents/document.service';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { ExemplaireDocumentService } from 'src/app/services/exemplaire-document/exemplaire-document.service';
import { IOrdreEtat } from 'src/app/modele/ordreEtat';

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
    estEncaissable: false,
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
          if (this.exemplaire.mouvements != undefined) {
            this.mouvements = this.exemplaire.mouvements;
          }
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
          this.courant = x.ordreEtats![x.ordreEtats!.length - 1].etat.libelle;

        });
    }
    this.titre = this.dataEnteteMenuService.dataEnteteMenu;
  }
}
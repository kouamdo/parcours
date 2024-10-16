import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IDocument } from 'src/app/modele/document';
import { DocumentService } from 'src/app/services/documents/document.service';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { ModalChoixDocEtatComponent } from '../modal-choix-doc-etat/modal-choix-doc-etat.component';
import { Observable, mergeMap, of } from 'rxjs';

@Component({
  selector: 'app-modal-choix-sous-document',
  templateUrl: './modal-choix-sous-document.component.html',
  styleUrls: ['./modal-choix-sous-document.component.scss'],
})
export class ModalChoixSousDocumentComponent implements OnInit {
  formeDocument: FormGroup;
  selectedEtatsMap: { [documentId: string]: string } = {};
  myControl = new FormControl<string | IDocument>('');
  ELEMENTS_TABLE_DOCUMENTS: IDocument[] = [];
  ELEMENTS_TABLE_DOCUMENTS_TEMP: IDocument[] = []; // Stockage temporaire pour les changements
  filteredOptions: IDocument[] | undefined;
  displayedDocumentsColumns: string[] = ['actions', 'titre', 'description'];
  documentIds: string[];
  displayedDocumentsColumnsOnSelect: string[] = ['actions', 'titre', 'description', 'etat'];

  dataSourceDocument = new MatTableDataSource<IDocument>(this.ELEMENTS_TABLE_DOCUMENTS);
  dataSourceDocumentResultat = new MatTableDataSource<IDocument>();
  idDocument: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private formBuilder: FormBuilder,
    private serviceDocument: DocumentService,
    private dialogRef: MatDialogRef<ModalChoixSousDocumentComponent>,
    private donneeDocCatService: DonneesEchangeService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formeDocument = this.formBuilder.group({});
    this.documentIds = this.data?.documentIds ?? [];
  }

  // Annuler et fermer la boîte de dialogue
  onCancel() {
    this.dialogRef.close();
  }

  // Ouvrir le modal pour choisir l'état du document
  openModal(documentChoisi: IDocument) {
    const dialogRef = this.dialog.open(ModalChoixDocEtatComponent, {
      width: '600px',
      data: {
        documentChoisi: documentChoisi,
        documentId: documentChoisi.idDocument,
      },
    });

    dialogRef.afterClosed().subscribe((selectedEtat: string) => {
      this.populateSelectedEtatsMap();
      if (selectedEtat) {
        this.selectedEtatsMap[documentChoisi.idDocument] = selectedEtat;
      }
    });
  }

  ngOnInit(): void {
    this.getAllDocument().subscribe((valeurs) => {
      this.dataSourceDocument.data = valeurs;
      this.filteredOptions = valeurs;
    });

    this.populateSelectedEtatsMap();
    if (this.documentIds.length > 0) {
      this.ELEMENTS_TABLE_DOCUMENTS_TEMP = [...this.donneeDocCatService.dataDocumentSousDocuments]; // Charger les données initiales dans temp
      this.dataSourceDocumentResultat.data = this.ELEMENTS_TABLE_DOCUMENTS_TEMP;
      this.loadDocuments(this.documentIds);
    }
  }

  // Charger les documents par leurs IDs
  loadDocuments(documentIds: string[]) {
    const documentObservables: Observable<IDocument>[] = documentIds.map((id) =>
      this.serviceDocument.getDocumentById(id)
    );
    of(...documentObservables)
      .pipe(mergeMap((obs) => obs))
      .subscribe((document) => {
        this.ELEMENTS_TABLE_DOCUMENTS.push(document);
        this.dataSourceDocumentResultat.data = this.ELEMENTS_TABLE_DOCUMENTS;
        this.populateSelectedEtatsMap();
      });
  }

  // Remplir la carte des états sélectionnés
  private populateSelectedEtatsMap() {
    this.dataSourceDocumentResultat.data.forEach((element: IDocument) => {
      const etat = this.serviceDocument.getSelectedEtat(element.idDocument);
      if (etat) {
        this.selectedEtatsMap[element.idDocument] = etat;
      }
    });
  }

  // Gérer le changement de sélection de document
  onCheckDocumentChange(event: any) {
    let listidDocumentTemp: string[] = [];
    let positionsDocument = new Map();
    let indexDocumentCourant: number = 0;
    this.ELEMENTS_TABLE_DOCUMENTS_TEMP.forEach((element: IDocument) => {
      listidDocumentTemp.push(element.idDocument);
      positionsDocument.set(element.idDocument, indexDocumentCourant++);
    });
    if (event.target.checked) {
      if (!listidDocumentTemp.includes(this.idDocument)) {
        this.ajoutSelectionDocument(this.idDocument);
      }
    } else {
      if (listidDocumentTemp.includes(this.idDocument)) {
        const index = positionsDocument.get(this.idDocument);
        this.retirerSelectionDocument(index);
      }
    }
  }

  // Obtenir l'ID du document sélectionné
  getDocumentId(idDocument: string) {
    this.idDocument = idDocument;
  }

  // Ajouter un document à la sélection
  ajoutSelectionDocument(idDocument: string) {
    this.serviceDocument.getDocumentById(idDocument).subscribe((val) => {
      this.ELEMENTS_TABLE_DOCUMENTS_TEMP.push(val);
      this.dataSourceDocumentResultat.data = this.ELEMENTS_TABLE_DOCUMENTS_TEMP;
    });
  }

  // Retirer un document de la sélection
  retirerSelectionDocument(index: number) {
    this.ELEMENTS_TABLE_DOCUMENTS_TEMP.splice(index, 1);
    this.dataSourceDocumentResultat.data = this.ELEMENTS_TABLE_DOCUMENTS_TEMP;
  }

  // Obtenir tous les documents
  private getAllDocument() {
    return this.serviceDocument.getAllDocuments();
  }

  // Fonction pour afficher le titre du document dans l'autocomplete
  displayFn(preco: IDocument): string {
    return preco && preco.titre ? preco.titre : '';
  }

  ngAfterViewInit() {
    this.dataSourceDocument.paginator = this.paginator;
    this.dataSourceDocument.sort = this.sort;
  }

  // Rechercher des documents par titre
  public rechercherListingDocuments(option: IDocument) {
    this.serviceDocument
      .getDocumentByTitre(option.titre.toLowerCase())
      .subscribe((valeurs) => {
        this.dataSourceDocument.data = valeurs;
      });
  }

  // Annoncer le changement de tri
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      // Annonce de changement de tri
    } else {
      // Annonce de tri réinitialisé
    }
  }

  // Vérifier si un document est sélectionné
  isDocumentSelected(documentId: string): boolean {
    return this.ELEMENTS_TABLE_DOCUMENTS_TEMP.some((doc) => doc.idDocument === documentId);
  }

  // Sauvegarder les changements et fermer la boîte de dialogue
  onSave() {
    this.ELEMENTS_TABLE_DOCUMENTS = [...this.ELEMENTS_TABLE_DOCUMENTS_TEMP]; // Finaliser les changements
    this.donneeDocCatService.dataDocumentSousDocuments = this.ELEMENTS_TABLE_DOCUMENTS;
    this.dialogRef.close(this.ELEMENTS_TABLE_DOCUMENTS);
  }
}

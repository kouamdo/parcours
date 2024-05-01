import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  selectedEtatsMap: { [documentId: string]: string } = {};
  myControl = new FormControl<string | IDocument>('');
  ELEMENTS_TABLE_DOCUMENTS: IDocument[] = [];
  filteredOptions: IDocument[] | undefined;
  displayedDocumentsColumns: string[] = ['actions', 'titre', 'description'];
  documentIds: string[];
  displayedDocumentsColumnsOnSelect: string[] = [
    'actions',
    'titre',
    'description',
    'etat',
  ];

  dataSourceDocument = new MatTableDataSource<IDocument>(
    this.ELEMENTS_TABLE_DOCUMENTS
  );
  dataSourceDocumentResultat = new MatTableDataSource<IDocument>();
  idDocument: string = '';

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private formBuilder: FormBuilder,
    private serviceDocument: DocumentService,
    private donneeDocCatService: DonneesEchangeService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.documentIds = this.data?.documentIds ?? [];
    console.log('Document IDs received:', data);
  }

  openModal(documentChoisi: IDocument) {
    const dialogRef = this.dialog.open(ModalChoixDocEtatComponent, {
      width: '600px',
      data: {
        documentChoisi: documentChoisi,
        documentId: documentChoisi.id,
      },
    });

    dialogRef.afterClosed().subscribe((selectedEtat: string) => {
      this.populateSelectedEtatsMap();
      if (selectedEtat) {
        this.selectedEtatsMap[documentChoisi.id] = selectedEtat;
      }
    });
  }

  ngOnInit(): void {
    this.getAllDocument().subscribe((valeurs) => {
      this.dataSourceDocument.data = valeurs;
      this.filteredOptions = valeurs;
    });

    // Call a method to populate selectedEtatsMap after the data is available
    this.populateSelectedEtatsMap();
    if (this.documentIds.length > 0) {
      this.dataSourceDocumentResultat.data =
        this.donneeDocCatService.dataDocumentSousDocuments;
      this.loadDocuments(this.documentIds);
    }
  }
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
        console.log('sous-doc', this.dataSourceDocumentResultat.data);
      });
  }

  private populateSelectedEtatsMap() {
    this.dataSourceDocumentResultat.data.forEach((element: IDocument) => {
      const etat = this.serviceDocument.getSelectedEtat(element.id);

      if (etat) {
        this.selectedEtatsMap[element.id] = etat;
      }
    });
  }

  onCheckDocumentChange(event: any) {
    let listidDocumentTemp: string[] = [];
    let positionsDocument = new Map();
    let indexDocumentCourant: number = 0;
    this.donneeDocCatService.dataDocumentSousDocuments?.forEach(
      (element: IDocument) => {
        listidDocumentTemp.push(element.id);
        positionsDocument.set(element.id, indexDocumentCourant++);
      }
    );
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

  getDocumentId(idDocument: string) {
    this.idDocument = idDocument;
  }

  ajoutSelectionDocument(idDocument: string) {
    this.serviceDocument.getDocumentById(idDocument).subscribe((val) => {
      this.ELEMENTS_TABLE_DOCUMENTS = this.dataSourceDocumentResultat.data;
      this.ELEMENTS_TABLE_DOCUMENTS.push(val);
      this.dataSourceDocumentResultat.data = this.ELEMENTS_TABLE_DOCUMENTS;
      this.donneeDocCatService.dataDocumentSousDocuments =
        this.ELEMENTS_TABLE_DOCUMENTS;
    });
  }

  retirerSelectionDocument(index: number) {
    this.ELEMENTS_TABLE_DOCUMENTS = this.dataSourceDocumentResultat.data;
    this.ELEMENTS_TABLE_DOCUMENTS.splice(index, 1);
    this.dataSourceDocumentResultat.data = this.ELEMENTS_TABLE_DOCUMENTS;
    this.donneeDocCatService.dataDocumentSousDocuments =
      this.ELEMENTS_TABLE_DOCUMENTS;
  }

  private getAllDocument() {
    return this.serviceDocument.getAllDocuments();
  }

  displayFn(preco: IDocument): string {
    return preco && preco.titre ? preco.titre : '';
  }

  ngAfterViewInit() {
    this.dataSourceDocument.paginator = this.paginator;
    this.dataSourceDocument.sort = this.sort;
  }

  public rechercherListingDocuments(option: IDocument) {
    this.serviceDocument
      .getDocumentByTitre(option.titre.toLowerCase())
      .subscribe((valeurs) => {
        this.dataSourceDocument.data = valeurs;
      });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      // Announce sorting change
    } else {
      // Announce sorting cleared
    }
  }
}

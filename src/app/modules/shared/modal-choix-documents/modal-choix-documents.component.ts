import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { IDocument } from 'src/app/modele/document';
import { DocumentService } from 'src/app/services/documents/document.service';

@Component({
  selector: 'app-modal-choix-documents',
  templateUrl: './modal-choix-documents.component.html',
  styleUrls: ['./modal-choix-documents.component.scss'],
})
export class ModalChoixDocumentsComponent implements OnInit {
  // variables attributs, pour afficher le tableau d'attributs sur l'IHM
  formeDocument: FormGroup;
  myControl = new FormControl<string | IDocument>('');
  ELEMENTS_TABLE_DOCUMENTS: IDocument[] = [];
  filteredOptions: IDocument[] | undefined;
  displayedDocumentsColumns: string[] = ['actions', 'titre', 'etat']; // structure du tableau presentant les attributs
  /* dataSourceDocument = new MatTableDataSource<IDocument>(
    this.ELEMENTS_TABLE_DOCUMENTS
  );
  dataSourceDocumentResultat = new MatTableDataSource<IDocument>();
  idDocument: string = '';*/

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
    private _liveAnnouncer: LiveAnnouncer,
    //private donneeDocCatService:DonneesEchangeService,
    private donneeEtapCatService: DonneesEchangeService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formeDocument = this.formBuilder.group({
      etat: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllDocument().subscribe((valeurs) => {
      this.dataSourceDocument.data = valeurs;
    });
    this.dataSourceDocumentResultat.data =
      this.donneeEtapCatService.dataEtapeDocuments;
    this.myControl.valueChanges.subscribe((value) => {
      const titre = typeof value === 'string' ? value : value?.titre;
      if (titre != undefined && titre?.length > 0) {
        this.serviceDocument
          .getDocumentByTitre(titre.toLowerCase() as string)
          .subscribe((reponse) => {
            this.filteredOptions = reponse;
          });
      } else {
        this.filteredOptions = [];
      }
    });
    this.formeDocument.get('etat')?.valueChanges.subscribe(() => {
      this.formeDocument.get('etat')?.markAsTouched();
      console.log(this.formeDocument.get('etat'));
    });
  }
  onCheckDocumentChange(event: any) {
    let listidDocumentTemp: string[] = [];
    let positionsDocument = new Map();
    let indexDocumentCourant: number = 0;
    this.donneeEtapCatService.dataDocumentSousDocuments?.forEach(
      (element: IDocument) => {
        listidDocumentTemp.push(element.idDocument);
        positionsDocument.set(element.idDocument, indexDocumentCourant++);
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
      this.donneeEtapCatService.dataDocumentSousDocuments =
        this.ELEMENTS_TABLE_DOCUMENTS;
    });
  }

  retirerSelectionDocument(index: number) {
    this.ELEMENTS_TABLE_DOCUMENTS = this.dataSourceDocumentResultat.data;
    this.ELEMENTS_TABLE_DOCUMENTS.splice(index, 1); // je supprime un seul element du tableau a la position 'index'
    this.dataSourceDocumentResultat.data = this.ELEMENTS_TABLE_DOCUMENTS;
    this.donneeEtapCatService.dataDocumentSousDocuments =
      this.ELEMENTS_TABLE_DOCUMENTS;
  }
  private getAllDocument() {
    return this.serviceDocument.getAllDocuments();
  }
  displayFn(document: IDocument): string {
    return document && document.titre ? document.titre : '';
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
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  logEtatControlState() {
    console.log(this.formeDocument.get('etat'));
  }
}

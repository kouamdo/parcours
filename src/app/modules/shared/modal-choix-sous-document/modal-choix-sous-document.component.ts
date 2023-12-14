import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { IDocument } from 'src/app/modele/document';
import { DocumentService } from 'src/app/services/documents/document.service';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';

@Component({
  selector: 'app-modal-choix-sous-document',
  templateUrl: './modal-choix-sous-document.component.html',
  styleUrls: ['./modal-choix-sous-document.component.scss']
})
export class ModalChoixSousDocumentComponent implements OnInit {
  formeDocument: FormGroup;
  myControl = new FormControl<string | IDocument>('');
  ELEMENTS_TABLE_DOCUMENTS: IDocument[] = [];
  filteredOptions: IDocument[] | undefined;
  displayedDocumentsColumns: string[] = [
    'actions',
    'titre',
    'description'
  ]; // structure du tableau presentant les documents
  
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
    private donneeDocCatService:DonneesEchangeService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    
    this.formeDocument = this.formBuilder.group({
    });
  }

  ngOnInit(): void {
    this.getAllDocument().subscribe((valeurs) => {
      this.dataSourceDocument.data = valeurs;
    });
    this.dataSourceDocumentResultat.data = this.donneeDocCatService.dataDocumentSousDocuments
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
  }
  onCheckDocumentChange(event: any) {
        console.log('ehhe', this.idDocument)
    let listidDocumentTemp : string[] = []
    let positionsDocument = new Map()
    let indexDocumentCourant : number = 0
    this.donneeDocCatService.dataDocumentSousDocuments?.forEach(
      (element: IDocument) => {
        listidDocumentTemp.push(element.id)
        positionsDocument.set(element.id, indexDocumentCourant++)
    });
    if (event.target.checked) {
      if (!listidDocumentTemp.includes(this.idDocument)) {
        this.ajoutSelectionDocument(this.idDocument);
      }
    } else {
      if (listidDocumentTemp.includes(this.idDocument)) {
        const index = positionsDocument.get(this.idDocument)
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
      this.donneeDocCatService.dataDocumentSousDocuments = this.ELEMENTS_TABLE_DOCUMENTS
    });
  }

  retirerSelectionDocument(index: number) {
    this.ELEMENTS_TABLE_DOCUMENTS = this.dataSourceDocumentResultat.data;
    this.ELEMENTS_TABLE_DOCUMENTS.splice(index, 1); // je supprime un seul element du tableau a la position 'index'
    this.dataSourceDocumentResultat.data = this.ELEMENTS_TABLE_DOCUMENTS;
    this.donneeDocCatService.dataDocumentSousDocuments = this.ELEMENTS_TABLE_DOCUMENTS
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
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}

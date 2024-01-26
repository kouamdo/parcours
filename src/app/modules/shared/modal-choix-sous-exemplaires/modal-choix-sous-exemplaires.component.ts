import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IExemplaireDocument } from 'src/app/modele/exemplaire-document';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { ExemplaireDocumentService } from 'src/app/services/exemplaire-document/exemplaire-document.service';

@Component({
  selector: 'app-modal-choix-sous-exemplaires',
  templateUrl: './modal-choix-sous-exemplaires.component.html',
  styleUrls: ['./modal-choix-sous-exemplaires.component.scss']
})
export class ModalChoixSousExemplairesComponent implements OnInit {
  myControl = new FormControl<string | IExemplaireDocument>('');
  ELEMENTS_TABLE_EXEMPLAIRE_DOCUMENTS: IExemplaireDocument[] = [];
  filteredOptions: IExemplaireDocument[] | undefined;
  displayedDocumentsColumns: string[] = [
    'actions',
    'titre',
    'description'
  ]; // structure du tableau presentant les Exemplaires de documents
  
  dataSourceExemplaireDocument = new MatTableDataSource<IExemplaireDocument>(
    this.ELEMENTS_TABLE_EXEMPLAIRE_DOCUMENTS
  );
  dataSourceExemplaireDocumentResultat = new MatTableDataSource<IExemplaireDocument>();
  idDocument: string = '';

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private serviceExemplaire: ExemplaireDocumentService,
    private _liveAnnouncer: LiveAnnouncer,
    private donneeExemplaireDocService:DonneesEchangeService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.getAllExemplaireDocument().subscribe((valeurs) => {
      this.dataSourceExemplaireDocument.data = valeurs;
      this.filteredOptions = valeurs
    });
    this.dataSourceExemplaireDocumentResultat.data = this.donneeExemplaireDocService.dataDocumentSousDocuments
    this.myControl.valueChanges.subscribe((value) => {
      const titre = typeof value === 'string' ? value : value?.titre;
      if (titre != undefined && titre?.length > 0) {
        this.serviceExemplaire
          .getExemplaireDocumentByTitre(titre.toLowerCase() as string)
          .subscribe((reponse) => {
            this.filteredOptions = reponse;
          });
      } else {
        this.serviceExemplaire.getAllExemplaireDocuments().subscribe(
          (reponse) =>{
            this.filteredOptions=reponse
          }
        )
      }
    });
  }
  onCheckDocumentChange(event: any) {
    let listidDocumentTemp : string[] = []
    let positionsDocument = new Map()
    let indexDocumentCourant : number = 0
    this.donneeExemplaireDocService.dataDocumentSousDocuments?.forEach(
      (element: IExemplaireDocument) => {
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

  choisirDocument(){
    let valeurIdDocument  = sessionStorage.getItem("idDocumentPourExemplaire")
    this.router.navigate(['exemplaire-nouveau/'.concat(valeurIdDocument!)]);
  }

  ajoutSelectionDocument(idDocument: string) {
    this.serviceExemplaire.getExemplaireDocumentById(idDocument).subscribe((val) => {
      this.ELEMENTS_TABLE_EXEMPLAIRE_DOCUMENTS = this.dataSourceExemplaireDocumentResultat.data;
      this.ELEMENTS_TABLE_EXEMPLAIRE_DOCUMENTS.push(val);
      this.dataSourceExemplaireDocumentResultat.data = this.ELEMENTS_TABLE_EXEMPLAIRE_DOCUMENTS;
      this.donneeExemplaireDocService.dataDocumentSousDocuments = this.ELEMENTS_TABLE_EXEMPLAIRE_DOCUMENTS
    });
  }

  retirerSelectionDocument(index: number) {
    this.ELEMENTS_TABLE_EXEMPLAIRE_DOCUMENTS = this.dataSourceExemplaireDocumentResultat.data;
    this.ELEMENTS_TABLE_EXEMPLAIRE_DOCUMENTS.splice(index, 1); // je supprime un seul element du tableau a la position 'index'
    this.dataSourceExemplaireDocumentResultat.data = this.ELEMENTS_TABLE_EXEMPLAIRE_DOCUMENTS;
    this.donneeExemplaireDocService.dataDocumentSousDocuments = this.ELEMENTS_TABLE_EXEMPLAIRE_DOCUMENTS
  }
  private getAllExemplaireDocument() {
    return this.serviceExemplaire.getAllExemplaireDocuments();
  }
  displayFn(preco: IExemplaireDocument): string {
    return preco && preco.titre ? preco.titre : '';
  }

  ngAfterViewInit() {
    this.dataSourceExemplaireDocument.paginator = this.paginator;
    this.dataSourceExemplaireDocument.sort = this.sort;
  }

  public rechercherListingExemplaireDocuments(option: IExemplaireDocument) {
    this.serviceExemplaire
      .getExemplaireDocumentByTitre(option.titre.toLowerCase())
      .subscribe((valeurs) => {
        this.dataSourceExemplaireDocument.data = valeurs;
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

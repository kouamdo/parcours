import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IDocument } from 'src/app/modele/document';
import { IExemplaireDocument } from 'src/app/modele/exemplaire-document';
import { DocumentService } from 'src/app/services/documents/document.service';
import { ExemplaireDocumentService } from 'src/app/services/exemplaire-document/exemplaire-document.service';

@Component({
  selector: 'app-list-exemplaire',
  templateUrl: './list-exemplaire.component.html',
  styleUrls: ['./list-exemplaire.component.scss']
})
export class ListExemplaireComponent implements OnInit {

  myControl = new FormControl<string | IExemplaireDocument>('');

  ELEMENTS_TABLE: IExemplaireDocument[] = [];
  ELEMENTS_TABLE_DOCUMENT: IDocument[] = [];
  filteredOptions: IDocument[] | undefined;

  displayedColumns: string[] = ['titre', 'description', 'actions'];

  dataSource = new MatTableDataSource<IExemplaireDocument>(this.ELEMENTS_TABLE);
  dataSourceDocument = new MatTableDataSource<IDocument>(this.ELEMENTS_TABLE_DOCUMENT);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  constructor(private translate: TranslateService, private router:Router, private serviceExemplaireDocument: ExemplaireDocumentService, private serviceDocument: DocumentService,  private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {
    this.getAllExemplaires().subscribe(valeurs => {
      this.dataSource.data = valeurs;
    });

    this.myControl.valueChanges.subscribe(
      value => {
        this.dataSource.data.forEach(
          exemplaire =>{
            if(exemplaire?.idDocument){
              this.serviceDocument.getDocumentById(exemplaire?.idDocument).subscribe(
                document =>{
                  this.ELEMENTS_TABLE_DOCUMENT.push(document);
                  const titre = typeof document === 'string' ? document : document?.titre;
                  if(titre != undefined && titre?.length >0){
                    this.serviceDocument.getDocumentByTitre(titre.toLowerCase() as string).subscribe(
                      reponse => {
                        this.filteredOptions = reponse;
                      }
                    )
                  }
                  else{
                    this.filteredOptions = [];
                  }
                }
              );
            }
          }
        )
      }
    );
  }
  displayFn(document: IDocument): string {
    return document && document.titre ? document.titre : '';
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  public rechercherListingDocument(option: IDocument){
    this.serviceDocument.getDocumentByTitre(option.titre.toLowerCase()).subscribe(
        valeurs => {this.dataSourceDocument.data = valeurs;}
    )
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  private getAllExemplaires(){
    return this.serviceExemplaireDocument.getAllExemplaireDocuments();
  }

  private getAllDocuments(){
    return this.serviceDocument.getAllDocuments();
  }
}

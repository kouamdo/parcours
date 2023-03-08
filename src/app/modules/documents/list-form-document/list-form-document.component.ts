import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, EMPTY } from 'rxjs';
import { IAttributs } from 'src/app/modele/attributs';
import { IDocument } from 'src/app/modele/document';
import { DocumentService } from 'src/app/services/documents/document.service';

@Component({
  selector: 'app-list-form-document',
  templateUrl: './list-form-document.component.html',
  styleUrls: ['./list-form-document.component.scss']
})
export class ListFormDocumentComponent implements OnInit, AfterViewInit {

  document$:Observable<IDocument[]>=EMPTY;
  myControl = new FormControl<string | IDocument>('');
 
  ELEMENTS_TABLE: IDocument[] = [];
  filteredOptions: IDocument[] | undefined;

  displayedColumns: string[] = ['id', 'titre', 'description', 'missions', 'attributs', 'actions'];

  dataSource = new MatTableDataSource<IDocument>(this.ELEMENTS_TABLE);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  missionsParDocuments! : IAttributs[];
  attributsParDocuments! : IAttributs[]

  constructor(private translate: TranslateService, private router:Router, private serviceDocument: DocumentService,  private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {
    this.document$ = this.getAllDocuments();
    this.document$.subscribe(
      x=>{
        // if(x!=null && x.attributs=null){
        //   this.attributsParDocuments = x.attributs;
        // }
      }
    )
    this.getAllDocuments().subscribe(valeurs => {
      this.dataSource.data = valeurs;
      // if(valeurs!=null && valeurs.attributs!=null){
      //   this.attributsParDocuments = x.attributs;
      // }
    });

    this.myControl.valueChanges.subscribe(
      value => {
        const titre = typeof value === 'string' ? value : value?.titre;
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
  displayFn(document: IDocument): string {
    return document && document.titre ? document.titre : '';
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  public rechercherListingDocument(option: IDocument){
    this.serviceDocument.getDocumentByTitre(option.titre.toLowerCase()).subscribe(
        valeurs => {this.dataSource.data = valeurs;}
    )
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  private getAllDocuments(){
    return this.serviceDocument.getAllDocuments();
  }
}

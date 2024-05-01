import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, EMPTY } from 'rxjs';
import { IAfficheDocument } from 'src/app/modele/affiche-document';
import { IAttributs } from 'src/app/modele/attributs';
import { IDocument } from 'src/app/modele/document';
import { TypeMvt } from 'src/app/modele/type-mvt';
import { DocumentService } from 'src/app/services/documents/document.service';
import { ModalDocEtatsComponent } from '../../shared/modal-doc-etats/modal-doc-etats.component';

@Component({
  selector: 'app-list-form-document',
  templateUrl: './list-form-document.component.html',
  styleUrls: ['./list-form-document.component.scss']
})
export class ListFormDocumentComponent implements OnInit, AfterViewInit {

  myControl = new FormControl<string | IDocument>('');

  ELEMENTS_TABLE: IAfficheDocument[] = [];
  filteredOptions: IDocument[] | undefined;

  displayedColumns: string[] = ['titre', 'description', 'typeMouvement', 'etat', 'missions', 'attributs', 'categories', 'actions'];

  dataSource = new MatTableDataSource<IAfficheDocument>(this.ELEMENTS_TABLE);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  tableDocuments : IAfficheDocument[] = []


  afficheDocument : IAfficheDocument = {
    id: '',
    titre: '',
    description: '',
    missions: [],
    attributs: [],
    categories: [],
    listeMissions: '',
    listAttributs: '',
    listCategories: '',
    listPreconisations: '',
    preconisations: [],
    sousDocuments: [],
    listSousDocuments: '',
    etat: false,
    typeMouvement: 'Neutre',
    affichagePrix: false,
    contientRessources: false,
    contientDistributeurs: false,
    listDocEtats: '',
    DocEtats: []
  }

  constructor(private translate: TranslateService, private router:Router,
    private serviceDocument: DocumentService,  private _liveAnnouncer: LiveAnnouncer,
    private dialogDef : MatDialog
  ) { }

  ngOnInit(): void {
    this.getAllDocuments().subscribe(valeurs => {
     const tableDocuments : IAfficheDocument[] = [];

      valeurs.forEach(
        x =>{
          tableDocuments.push(this.convertDocToDocAffiche(x))
        }
      )
      this.dataSource.data = tableDocuments;
      this.filteredOptions = valeurs
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
          this.serviceDocument.getAllDocuments().subscribe(
            (resultat) =>{
              this.filteredOptions = resultat
            }
          )
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
        valeurs => {
          const tableDocuments : IAfficheDocument[] = [];
          valeurs.forEach(
            x =>{
              tableDocuments.push(this.convertDocToDocAffiche(x))
            }
          )
          this.dataSource.data = tableDocuments;
        }
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

  private convertDocToDocAffiche(x: IDocument) : IAfficheDocument {
   let  afficheDocument  : IAfficheDocument = {
     listeMissions: '',
     listAttributs: '',
     listCategories: '',
     listPreconisations: '',
     listSousDocuments: '',
     listDocEtats: '',
     id: '',
     titre: '',
     description: '',
     etat: false,
     typeMouvement: "Neutre",
     affichagePrix: false,
     contientRessources: false,
     contientDistributeurs: false,
     missions: [],
     attributs: [],
     categories: [],
     preconisations: [],
     DocEtats: []
   }
    afficheDocument.id = x.id;
    afficheDocument.titre = x.titre;
    afficheDocument.description = x.description;
    afficheDocument.etat = x.etat;
    afficheDocument.missions = x.missions;
    afficheDocument.attributs = x.attributs;
      x.missions.forEach(
        m => {
          afficheDocument.listeMissions += m.libelle + ", ";
        }
      )
      x.attributs.forEach(
        a => afficheDocument.listAttributs += a.titre + ", "
      )
      x.categories.forEach(
        c => afficheDocument.listCategories += c.nom + ", "
      )
      x.preconisations.forEach(
        p => afficheDocument.listPreconisations += p.libelle + ", "
      )
      x.DocEtats.forEach(
        de => afficheDocument.listDocEtats += de.etat.libelle + ", "
      )
      return afficheDocument;
  }
}

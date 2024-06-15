import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FormControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { IAttributs } from 'src/app/modele/attributs';
import { AttributService } from 'src/app/services/attributs/attribut.service';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';

@Component({
  selector: 'app-modal-choix-attributs',
  templateUrl: './modal-choix-attributs.component.html',
  styleUrls: ['./modal-choix-attributs.component.scss'],
})
export class ModalChoixAttributsComponent implements OnInit {
  // variables attributs, pour afficher le tableau d'attributs sur l'IHM
  formeAttribut: FormGroup;
  myControl = new FormControl<string | IAttributs>('');
  ELEMENTS_TABLE_ATTRIBUTS: IAttributs[] = [];
  filteredOptions: IAttributs[] | undefined;
  displayedAttributsColumns: string[] = [
    'actions',
    'titre',
    'description',
    'type'
  ]; // structure du tableau presentant les attributs
  dataSourceAttribut = new MatTableDataSource<IAttributs>(
    this.ELEMENTS_TABLE_ATTRIBUTS
  );
  dataSourceAttributResultat = new MatTableDataSource<IAttributs>();
  idAttribut: string = '';

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private infosPath: ActivatedRoute,
    private serviceAttribut: AttributService,
    private _liveAnnouncer: LiveAnnouncer,
    private donneeDocCatService:DonneesEchangeService,
    private dialogDef: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formeAttribut = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.getAllAttributs().subscribe((valeurs) => {
      this.dataSourceAttribut.data = valeurs;
      this.filteredOptions = valeurs
    });
    this.dataSourceAttributResultat.data = this.donneeDocCatService.dataDocumentAttributs
    this.myControl.valueChanges.subscribe((value) => {
      const titre = typeof value === 'string' ? value : value?.titre;
      if (titre != undefined && titre?.length > 0) {
        this.serviceAttribut
          .getAttributsByTitre(titre.toLowerCase() as string)
          .subscribe((reponse) => {
            this.filteredOptions = reponse;
          });
      } else {
        this.serviceAttribut.getAllAttributs().subscribe(
          (reponse) =>{
            this.filteredOptions=reponse
          }
        )
      }
    });
  }

  onCheckAttributChange(event: any) {
    let listIdAttTemp : string[] = []
    let positionsAttr = new Map()
    let indexAttrCourant : number = 0
    this.donneeDocCatService.dataDocumentAttributs.forEach(
      (element: IAttributs) => {
        listIdAttTemp.push(element.id)
        positionsAttr.set(element.id, indexAttrCourant++)
    });
    if (event.target.checked) {
      if (!listIdAttTemp.includes(this.idAttribut)) {
        this.ajoutSelectionAttribut(this.idAttribut);
      }
    } else {
      if (listIdAttTemp.includes(this.idAttribut)) {
        const index = positionsAttr.get(this.idAttribut)
        this.retirerSelectionAttribut(index);
      }
    }
  }

  getAttributId(idAttribut: string) {
    this.idAttribut = idAttribut;
  }

  ajoutSelectionAttribut(idAttribut: string) {
    this.serviceAttribut.getAttributById(idAttribut).subscribe((val) => {
      this.ELEMENTS_TABLE_ATTRIBUTS = this.dataSourceAttributResultat.data;
      this.ELEMENTS_TABLE_ATTRIBUTS.push(val);
      this.dataSourceAttributResultat.data = this.ELEMENTS_TABLE_ATTRIBUTS;
      this.donneeDocCatService.dataDocumentAttributs = this.ELEMENTS_TABLE_ATTRIBUTS;
    });
  }

  retirerSelectionAttribut(index: number) {
    this.ELEMENTS_TABLE_ATTRIBUTS = this.dataSourceAttributResultat.data;
    this.ELEMENTS_TABLE_ATTRIBUTS.splice(index, 1); // je supprime un seul element du tableau a la position 'index'
    this.dataSourceAttributResultat.data = this.ELEMENTS_TABLE_ATTRIBUTS;
    this.donneeDocCatService.dataDocumentAttributs = this.ELEMENTS_TABLE_ATTRIBUTS;
  }
  private getAllAttributs() {
    return this.serviceAttribut.getAllAttributs();
  }
  displayFn(attribue: IAttributs): string {
    return attribue && attribue.titre ? attribue.titre : '';
  }

  ngAfterViewInit() {
    this.dataSourceAttribut.paginator = this.paginator;
    this.dataSourceAttribut.sort = this.sort;
  }

  public rechercherListingAttribut(option: IAttributs) {
    this.serviceAttribut
      .getAttributsByTitre(option.titre.toLowerCase())
      .subscribe((valeurs) => {
        this.dataSourceAttribut.data = valeurs;
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

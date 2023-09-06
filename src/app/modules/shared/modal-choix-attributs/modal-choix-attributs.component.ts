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
    'type',
  ]; // structure du tableau presentant les attributs
  displayedCategoriesAttributsColumns: string[] = [
    'actions',
    'titre',
    'description',
    'type',
    'ordreAtrParCat',
    'ordreCat',
  ]; // structure du tableau presentant les categories creees avec leurs attributs
  dataSourceAttribut = new MatTableDataSource<IAttributs>(
    this.ELEMENTS_TABLE_ATTRIBUTS
  );
  dataSourceAttributResultat = new MatTableDataSource<IAttributs>();
  _attributs: FormArray | undefined;
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
    this.formeAttribut = this.formBuilder.group({
      _attributs: new FormArray([]),
    });
  }

  ngOnInit(): void {
    this.getAllAttributs().subscribe((valeurs) => {
      this.dataSourceAttribut.data = valeurs;
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
        this.filteredOptions = [];
      }
    });
  }

  onCheckAttributChange(event: any) {
    const _attributs = this.formeAttribut.controls['_attributs'] as FormArray;
    if (event.target.checked) {
      _attributs.push(new FormControl(event.target.value));
      this.ajoutSelectionAttribut(this.idAttribut);
    } else {
      const index = _attributs.controls.findIndex(
        (x) => x.value === event.target.value
      );
      this.retirerSelectionAttribut(index);
      _attributs.removeAt(index);
    }
    this._attributs = _attributs;
  }

  getAttributId(idAttribut: string) {
    this.idAttribut = idAttribut;
  }

  ajoutSelectionAttribut(idAttribut: string) {
    this.serviceAttribut.getAttributById(idAttribut).subscribe((val) => {
      console.log('IdAttribut :' + val.id);
      this.ELEMENTS_TABLE_ATTRIBUTS = this.dataSourceAttributResultat.data;
      // this.dataSourceAttributResultat.data = this.dataSourceAttributDocument.data
      this.ELEMENTS_TABLE_ATTRIBUTS.push(val);
      this.dataSourceAttributResultat.data = this.ELEMENTS_TABLE_ATTRIBUTS;
      this.donneeDocCatService.dataDocumentAttributs = this.ELEMENTS_TABLE_ATTRIBUTS;
    });
  }

  retirerSelectionAttribut(index: number) {
    const _attributs = this.formeAttribut.controls['_attributs'] as FormArray;
    this.ELEMENTS_TABLE_ATTRIBUTS = this.dataSourceAttributResultat.data;
    this.ELEMENTS_TABLE_ATTRIBUTS.splice(index, 1); // je supprime un seul element du tableau a la position 'index'
    _attributs.removeAt(index);
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

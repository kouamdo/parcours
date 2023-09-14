import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { IPrecoMvt } from 'src/app/modele/precomvt';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { PrecoMvtsService } from 'src/app/services/precomvts/precomvts.service';

@Component({
  selector: 'app-modal-choix-preconisations',
  templateUrl: './modal-choix-preconisations.component.html',
  styleUrls: ['./modal-choix-preconisations.component.scss']
})
export class ModalChoixPreconisationsComponent implements OnInit {
  formePrecoMvt: FormGroup;
  myControl = new FormControl<string | IPrecoMvt>('');
  ELEMENTS_TABLE_PRECONISATIONS: IPrecoMvt[] = [];
  filteredOptions: IPrecoMvt[] | undefined;
  displayedPrecoMvtsColumns: string[] = [
    'actions',
    'libelle',
    'etat',
    'type'
  ]; // structure du tableau presentant les preconisations
  
  dataSourcePreco = new MatTableDataSource<IPrecoMvt>(
    this.ELEMENTS_TABLE_PRECONISATIONS
  );
  dataSourcePrecoResultat = new MatTableDataSource<IPrecoMvt>();
  _precoMvt: FormArray | undefined;
  idPrecoMvt: string = '';

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private infosPath: ActivatedRoute,
    private serviceprecoMvt: PrecoMvtsService,
    private _liveAnnouncer: LiveAnnouncer,
    private donneeDocCatService:DonneesEchangeService,
    private dialogDef: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formePrecoMvt = this.formBuilder.group({
      _precoMvt: new FormArray([]),
    });
  }

  ngOnInit(): void {
    this.getAllPrecoMvt().subscribe((valeurs) => {
      this.dataSourcePreco.data = valeurs;
    });
    this.dataSourcePrecoResultat.data = this.donneeDocCatService.dataDocumentPrecoMvts
    this.myControl.valueChanges.subscribe((value) => {
      const libelle = typeof value === 'string' ? value : value?.libelle;
      if (libelle != undefined && libelle?.length > 0) {
        this.serviceprecoMvt
          .getPrecomvtsByLibelle(libelle.toLowerCase() as string)
          .subscribe((reponse) => {
            this.filteredOptions = reponse;
          });
      } else {
        this.filteredOptions = [];
      }
    });
  }
  onCheckPrecoMvtChange(event: any) {
    const _precoMvt = this.formePrecoMvt.controls['_precoMvt'] as FormArray;
    if (event.target.checked) {
      _precoMvt.push(new FormControl(event.target.value));
      this.ajoutSelectionPrecoMvt(this.idPrecoMvt);
    } else {
      const index = _precoMvt.controls.findIndex(
        (x) => x.value === event.target.value
      );
      this.retirerSelectionPrecoMvt(index);
      _precoMvt.removeAt(index);
    }
    this._precoMvt = _precoMvt;
  }
  getPrecoMvtId(idPrecoMvt: string) {
    this.idPrecoMvt = idPrecoMvt;
  }

  ajoutSelectionPrecoMvt(idPrecoMvt: string) {
    this.serviceprecoMvt.getPrecomvtById(idPrecoMvt).subscribe((val) => {
      this.ELEMENTS_TABLE_PRECONISATIONS = this.dataSourcePrecoResultat.data;
      this.ELEMENTS_TABLE_PRECONISATIONS.push(val);
      this.dataSourcePrecoResultat.data = this.ELEMENTS_TABLE_PRECONISATIONS;
      this.donneeDocCatService.dataDocumentPrecoMvts = this.ELEMENTS_TABLE_PRECONISATIONS
    });
  }

  retirerSelectionPrecoMvt(index: number) {
    const _precoMvt = this.formePrecoMvt.controls['_precoMvt'] as FormArray;
    this.ELEMENTS_TABLE_PRECONISATIONS = this.dataSourcePrecoResultat.data;
    this.ELEMENTS_TABLE_PRECONISATIONS.splice(index, 1); // je supprime un seul element du tableau a la position 'index'
    _precoMvt.removeAt(index);
    this.dataSourcePrecoResultat.data = this.ELEMENTS_TABLE_PRECONISATIONS;
    this.donneeDocCatService.dataDocumentPrecoMvts = this.ELEMENTS_TABLE_PRECONISATIONS
  }
  private getAllPrecoMvt() {
    return this.serviceprecoMvt.getAllPrecomvts();
  }
  displayFn(preco: IPrecoMvt): string {
    return preco && preco.libelle ? preco.libelle : '';
  }

  ngAfterViewInit() {
    this.dataSourcePreco.paginator = this.paginator;
    this.dataSourcePreco.sort = this.sort;
  }

  public rechercherListingPreco(option: IPrecoMvt) {
    this.serviceprecoMvt
      .getPrecomvtsByLibelle(option.libelle.toLowerCase())
      .subscribe((valeurs) => {
        this.dataSourcePreco.data = valeurs;
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

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { IPrecoMvt } from 'src/app/modele/precomvt';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { PrecoMvtsService } from 'src/app/services/precomvts/precomvts.service';
import { ViewPrecomvtComponent } from '../../precomvt/view-precomvt/view-precomvt.component';

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
    'type'
  ];

  dataSourcePreco = new MatTableDataSource<IPrecoMvt>([]);
  dataSourcePrecoResultat = new MatTableDataSource<IPrecoMvt>([]);

  idPrecoMvt: string = '';
  selectedIds = new Set<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private infosPath: ActivatedRoute,
    private servicePrecoMvt: PrecoMvtsService,
    private _liveAnnouncer: LiveAnnouncer,
    private donneeDocCatService: DonneesEchangeService,
    private dialogDef: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formePrecoMvt = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.getAllPrecoMvt().subscribe((valeurs) => {
      this.dataSourcePreco.data = valeurs;
      this.filteredOptions = valeurs;
    });
    this.dataSourcePrecoResultat.data = this.donneeDocCatService.dataDocumentPrecoMvts;
    this.ELEMENTS_TABLE_PRECONISATIONS = [...this.dataSourcePrecoResultat.data];
    this.ELEMENTS_TABLE_PRECONISATIONS.forEach(item => this.selectedIds.add(item.id));
    this.myControl.valueChanges.subscribe((value) => {
      const libelle = typeof value === 'string' ? value : value?.libelle;
      if (libelle != undefined && libelle?.length > 0) {
        this.servicePrecoMvt
          .getPrecomvtsByLibelle(libelle.toLowerCase() as string)
          .subscribe((reponse) => {
            this.filteredOptions = reponse;
          });
      } else {
        this.servicePrecoMvt.getAllPrecomvts().subscribe(
          (reponse) => {
            this.filteredOptions = reponse;
          }
        );
      }
    });
  }

  onCheckPrecoMvtChange(event: any, element: IPrecoMvt) {
    if (event.target.checked) {
      if (!this.selectedIds.has(element.id)) {
        this.ajoutSelectionPrecoMvt(element.id);
      }
    } else {
      this.retirerSelectionPrecoMvt(element.id);
    }
  }

  getPrecoMvtId(idPrecoMvt: string) {
    this.idPrecoMvt = idPrecoMvt;
  }

  ajoutSelectionPrecoMvt(idPrecoMvt: string) {
    this.servicePrecoMvt.getPrecomvtById(idPrecoMvt).subscribe((val) => {
      this.ELEMENTS_TABLE_PRECONISATIONS = [...this.dataSourcePrecoResultat.data, val];
      this.dataSourcePrecoResultat.data = this.ELEMENTS_TABLE_PRECONISATIONS;
      this.selectedIds.add(idPrecoMvt);
    });
  }

  retirerSelectionPrecoMvt(idPrecoMvt: string) {
    this.ELEMENTS_TABLE_PRECONISATIONS = this.ELEMENTS_TABLE_PRECONISATIONS.filter(item => item.id !== idPrecoMvt);
    this.dataSourcePrecoResultat.data = this.ELEMENTS_TABLE_PRECONISATIONS;
    this.selectedIds.delete(idPrecoMvt);
  }

  onSave() {
    const categorie = this.ELEMENTS_TABLE_PRECONISATIONS;
    this.donneeDocCatService.dataDocumentPrecoMvts = categorie;
  }

  private getAllPrecoMvt() {
    return this.servicePrecoMvt.getAllPrecomvts();
  }

  displayFn(preco: IPrecoMvt): string {
    return preco && preco.libelle ? preco.libelle : '';
  }

  ngAfterViewInit() {
    this.dataSourcePreco.paginator = this.paginator;
    this.dataSourcePreco.sort = this.sort;
  }

  public rechercherListingPreco(option: IPrecoMvt) {
    this.servicePrecoMvt
      .getPrecomvtsByLibelle(option.libelle.toLowerCase())
      .subscribe((valeurs) => {
        this.dataSourcePreco.data = valeurs;
      });
  }

  openViewPrecoDialog() {
    this.dialogDef.open(ViewPrecomvtComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '100%',
      height: '100%',
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '1000ms',
      data: {
        idPrecoMvt: this.idPrecoMvt
      }
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

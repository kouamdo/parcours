import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, EMPTY } from 'rxjs';
import { IPrecoMvt } from 'src/app/modele/precomvt';
import { PrecoMvtsService } from 'src/app/services/precomvts/precomvts.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ViewPrecomvtComponent } from '../view-precomvt/view-precomvt.component';

@Component({
  selector: 'app-list-precomvts',
  templateUrl: './list-precomvts.component.html',
  styleUrls: ['./list-precomvts.component.scss']
})
export class ListPrecomvtsComponent implements OnInit {

    precomvt$:Observable<IPrecoMvt>=EMPTY;

    myControl = new FormControl<string | IPrecoMvt>('');

    ELEMENTS_TABLE: IPrecoMvt[] = [];
    filteredOptions: IPrecoMvt[] | undefined;
    displayedColumns: string[] = ['libelle', 'type', 'actions'];

    dataSource = new MatTableDataSource<IPrecoMvt>(this.ELEMENTS_TABLE);

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    @ViewChild(MatSort) sort!: MatSort;
    idPrecoMvt: string = '';

    constructor(private translate: TranslateService,private router:Router, private servicePrecoMvt:PrecoMvtsService, private _liveAnnouncer: LiveAnnouncer,
      private dialogDef: MatDialog) { }

    ngOnInit(): void {
      this.getAllPrecomvts().subscribe((valeurs: IPrecoMvt[]) => {
        this.dataSource.data = valeurs;
        this.filteredOptions = valeurs
      });

      this.myControl.valueChanges.subscribe(
        value => {
          const libelle = typeof value === 'string' ? value : value?.libelle;
          if(libelle != undefined && libelle?.length >0){
            this.servicePrecoMvt.getPrecomvtsByLibelle(libelle.toLowerCase() as string).subscribe(
              reponse => {
                this.filteredOptions = reponse;
              }
            )
          }
          else{
            this.servicePrecoMvt.getAllPrecomvts().subscribe(
              (reponse) =>{
                this.filteredOptions=reponse
              }
            )
          }
        }
      );
    }

    private getAllPrecomvts(){
      return this.servicePrecoMvt.getAllPrecomvts();
    }
    displayFn(precomvt: IPrecoMvt): string {
      return precomvt && precomvt.libelle ? precomvt.libelle : '';
    }

    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    public rechercherListingPrecomvt(option: IPrecoMvt){
      this.servicePrecoMvt.getPrecomvtsByLibelle(option.libelle.toLowerCase()).subscribe(
        //  valeurs => {this.dataSource.data = valeurs;}
      )
    }

    getPrecoMvtId(idPrecoMvt: string) {
      this.idPrecoMvt = idPrecoMvt;
    }

    openViewPrecoDialog(){
      this.dialogDef.open(ViewPrecomvtComponent, 
      {
        width:'100%',
        height:'100%',
        enterAnimationDuration:'1000ms',
        exitAnimationDuration:'1000ms',
        data:{
          idPrecoMvt : this.idPrecoMvt
        }
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

}

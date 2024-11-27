import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, EMPTY } from 'rxjs';
import { ICaisses } from 'src/app/modele/caisses';
import { CaissesService } from 'src/app/services/caisses/caisses.service';

@Component({
  selector: 'app-list-caisses',
  templateUrl: './list-caisses.component.html',
  styleUrls: ['./list-caisses.component.scss']
})
export class ListCaissesComponent implements OnInit {
  caisses$:Observable<ICaisses>=EMPTY;

  myControl = new FormControl<string | ICaisses>('');

  ELEMENTS_TABLE: ICaisses[] = [];
  filteredOptions: ICaisses[] | undefined;

  displayedColumns: string[] = ['libelle', 'solde','type','detailJson','actions'];

  dataSource = new MatTableDataSource<ICaisses>(this.ELEMENTS_TABLE);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private translate: TranslateService,private router:Router, private serviceCaisse:CaissesService, private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {
    this.getAllCaisses().subscribe(valeurs => {
      this.dataSource.data = valeurs;
        this.filteredOptions = valeurs
    });

    this.myControl.valueChanges.subscribe(
      value => {
        const libelle = typeof value === 'string' ? value : value?.libelle;
        if(libelle != undefined && libelle?.length >0){
          this.serviceCaisse.getCaissesByLibelle(libelle.toLowerCase() as string).subscribe(
            reponse => {
              this.filteredOptions = reponse;
            }
          )
        }
        else{
          this.serviceCaisse.getAllCaisses().subscribe(
            (resultat) =>{
              this.filteredOptions = resultat
            }
          )
        }
      }
    );
  }

  private getAllCaisses(){
    return this.serviceCaisse.getAllCaisses();
  }
  displayFn(caisse: ICaisses): string {
    return caisse && caisse.libelle ? caisse.libelle : '';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public rechercherListingCaisse(option: ICaisses){
    this.serviceCaisse.getCaissesByLibelle(option.libelle.toLowerCase()).subscribe(
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
}

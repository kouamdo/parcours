import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, EMPTY } from 'rxjs';
import { IComptes } from 'src/app/modele/comptes';
import { ComptesService } from 'src/app/services/comptes/comptes.service';
import { ModalAffecterComptePersonnelComponent } from '../../shared/modal-affecter-compte-personnel/modal-affecter-compte-personnel.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-list-comptes',
  templateUrl: './list-comptes.component.html',
  styleUrls: ['./list-comptes.component.scss']
})
export class ListComptesComponent implements OnInit {
  comptes$:Observable<IComptes>=EMPTY;

  myControl = new FormControl<string | IComptes>('');

  ELEMENTS_TABLE: IComptes[] = [];
  filteredOptions: IComptes[] | undefined;

  displayedColumns: string[] = ['libelle', 'solde','montantMax', 'personnel','dateCreation','actions'];

  dataSource = new MatTableDataSource<IComptes>(this.ELEMENTS_TABLE);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private translate: TranslateService, private router:Router, private serviceCompte:ComptesService, private dialogDef : MatDialog, private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {
    this.getAllComptes().subscribe(valeurs => {
      this.dataSource.data = valeurs;
        this.filteredOptions = valeurs
    });

    this.myControl.valueChanges.subscribe(
      value => {
        const libelle = typeof value === 'string' ? value : value?.libelle;
        if(libelle != undefined && libelle?.length >0){
          this.serviceCompte.getComptesByLibelle(libelle.toLowerCase() as string).subscribe(
            reponse => {
              this.filteredOptions = reponse;
            }
          )
        }
        else{
          this.serviceCompte.getAllComptes().subscribe(
            (resultat) =>{
              this.filteredOptions = resultat
            }
          )
        }
      }
    );
  }

  private getAllComptes(){
    return this.serviceCompte.getAllComptes();
  }
  displayFn(compte: IComptes): string {
    return compte && compte.libelle ? compte.libelle : '';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public rechercherListingCompte(option: IComptes){
    this.serviceCompte.getComptesByLibelle(option.libelle.toLowerCase()).subscribe(
        valeurs => {this.dataSource.data = valeurs;}
    )
  }

  openChoixPersonnelDialog(compte: IComptes){
    const dialogRef = this.dialogDef.open(ModalAffecterComptePersonnelComponent,
    {
      maxWidth: '100%',
      maxHeight: '100%',
      width:'100%',
      height:'100%',
      enterAnimationDuration:'1000ms',
      exitAnimationDuration:'1000ms',
      data:{compte}
    }
    )

    dialogRef.afterClosed().subscribe(result => { 
      this.getAllComptes().subscribe((valeurs) => {
        this.dataSource.data = valeurs;
        this.filteredOptions = valeurs;
      console.log("result:", result, valeurs);
      });    
      this.router.navigate([this.router.url]);
      
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

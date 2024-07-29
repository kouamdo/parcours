import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, EMPTY } from 'rxjs';
import { IAttributs } from 'src/app/modele/attributs';
import { IElements } from 'src/app/modele/elements';
import { PassActionService } from 'src/app/services/actions-view/pass-action.service';
import { AttributService } from 'src/app/services/attributs/attribut.service';

@Component({
  selector: 'app-list-attributs',
  templateUrl: './list-attributs.component.html',
  styleUrls: ['./list-attributs.component.scss']
})
export class ListAttributsComponent implements OnInit {
  attrubuts$:Observable<IAttributs>=EMPTY;
  receivedActions$: Observable<IElements[]>=EMPTY;
  actions : IElements[] | undefined;

  myControl = new FormControl<string | IAttributs>('');

  ELEMENTS_TABLE: IAttributs[] = [];
  filteredOptions: IAttributs[] | undefined;

  displayedColumns: string[] = ['titre', 'description', 'etat','type','valeursParDefaut','actions'];

  dataSource = new MatTableDataSource<IAttributs>(this.ELEMENTS_TABLE);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private translate: TranslateService,private router:Router, private serviceAttribut:AttributService, private _liveAnnouncer: LiveAnnouncer,
    private actionsview: PassActionService
  ) { }

  ngOnInit(): void {
    this.getAllAttributs().subscribe(valeurs => {
      this.dataSource.data = valeurs;
        this.filteredOptions = valeurs
    });
    this.actionsview.langueData$.subscribe(data => {
      this.receivedActions$ = this.actionsview.getActions();
      this.receivedActions$.subscribe(a => {
        if (a != null) {
          this.actions = a;
          console.log("Actions view :", a, this.receivedActions$);
        }
      });
    })

    this.myControl.valueChanges.subscribe(
      value => {
        const titre = typeof value === 'string' ? value : value?.titre;
        if(titre != undefined && titre?.length >0){
          this.serviceAttribut.getAttributsByTitre(titre.toLowerCase() as string).subscribe(
            reponse => {
              this.filteredOptions = reponse;
            }
          )
        }
        else{
          this.serviceAttribut.getAllAttributs().subscribe(
            (resultat) =>{
              this.filteredOptions = resultat
            }
          )
        }
      }
    );
  }

  private getAllAttributs(){
    return this.serviceAttribut.getAllAttributs();
  }
  displayFn(attribue: IAttributs): string {
    return attribue && attribue.titre ? attribue.titre : '';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public rechercherListingAttribut(option: IAttributs){
    this.serviceAttribut.getAttributsByTitre(option.titre.toLowerCase()).subscribe(
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

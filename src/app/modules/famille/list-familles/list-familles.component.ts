import {AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, Observable } from 'rxjs';
import { IService } from 'src/app/modele/service';
import { ITicket } from 'src/app/modele/ticket';
import { ServicesService } from 'src/app/services/services/services.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import {FormControl} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort, Sort} from '@angular/material/sort';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { IFamille } from 'src/app/modele/famille';
import { FamillesService } from 'src/app/services/familles/familles.service';
import { PassActionService } from 'src/app/services/actions-view/pass-action.service';
import { IElements } from 'src/app/modele/elements';

export interface User {
  libelle: string;
}


@Component({
  selector: 'app-list-familles',
  templateUrl: './list-familles.component.html',
  styleUrls: ['./list-familles.component.scss']
})

export class ListFamillesComponent implements OnInit, AfterViewInit {

  familles$:Observable<IFamille[]>=EMPTY;
  services$:Observable<IService[]>=EMPTY;
  tickets$:Observable<ITicket[]>=EMPTY;

  id_famille : string = "0";
  id_service : number = 0;
  libelle_famille : string = "";
  libelle_service : string = "";

  myControl = new FormControl<string | IFamille>('');
  receivedActions$: Observable<IElements[]>=EMPTY;
  actions : IElements[] | undefined;

  ELEMENTS_TABLE: IFamille[] = [];
  filteredOptions: IFamille[] | undefined;

  displayedColumns: string[] = ['libelle', 'description', 'etat','actions'];

  dataSource = new MatTableDataSource<IFamille>(this.ELEMENTS_TABLE);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private translate: TranslateService,private router:Router, private serviceFamille:FamillesService, private _liveAnnouncer: LiveAnnouncer, private serviceService:ServicesService, private serviceTicket:TicketsService, 
    private actionsview: PassActionService
  ) {

  }

  ngOnInit(): void {
    this.services$ = this.getAllServices();
    this.tickets$ = this.getAllTickets();
    this.actionsview.langueData$.subscribe(data => {
      this.receivedActions$ = this.actionsview.getActions();
      this.receivedActions$.subscribe(a => {
        if (a != null) {
          this.actions = a;
          console.log("Actions view :", a, this.receivedActions$);
        }
      });
    })

    this.getAllFamilles().subscribe(valeurs => {
      this.dataSource.data = valeurs;
      this.filteredOptions = valeurs
    });

    this.myControl.valueChanges.subscribe(
      value => {
        const libelle = typeof value === 'string' ? value : value?.libelle;
        if(libelle != undefined && libelle?.length >0){
          this.serviceFamille.getFamillesByLibelle(libelle.toLowerCase() as string).subscribe(
            reponse => {
              this.filteredOptions = reponse;
            }
          )
        }
        else{
          this.serviceFamille.getAllFamilles().subscribe(
            (reponse) =>{
              this.filteredOptions=reponse
            }
          )
        }

      }
    );
  }

  private getAllFamilles(){
    return this.serviceFamille.getAllFamilles();
  }

  displayFn(user: IFamille): string {
    return user && user.libelle ? user.libelle : '';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public rechercherListingFamille(option: IFamille){
    this.serviceFamille.getFamillesByLibelle(option.libelle.toLowerCase()).subscribe(
        valeurs => {this.dataSource.data = valeurs;}
    )
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  private getAllServices(){
    return this.serviceService.getAllServices();
  }
  private getAllTickets(){
    return this.serviceTicket.getAllTickets();
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ServicesService } from 'src/app/services/services/services.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import {FormControl} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort, Sort} from '@angular/material/sort';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { IDistributeur } from 'src/app/modele/distributeur';
import { DistributeursService } from 'src/app/services/distributeurs/distributeurs.service';
import { PassActionService } from 'src/app/services/actions-view/pass-action.service';
import { Observable, EMPTY } from 'rxjs';
import { IElements } from 'src/app/modele/elements';


export interface User {
  raisonSocial: string;
}


@Component({
  selector: 'app-list-distributeurs',
  templateUrl: './list-distributeurs.component.html',
  styleUrls: ['./list-distributeurs.component.scss']
})
export class ListDistributeursComponent implements OnInit {

  id_distributeur : string = "0";
  id_service : number = 0;
  raisonSocial_distributeur : string = "";
  raisonSocial_service : string = "";


  myControl = new FormControl<string | IDistributeur>('');
  receivedActions$: Observable<IElements[]>=EMPTY;
  actions : IElements[] | undefined;

  ELEMENTS_TABLE: IDistributeur[] = [];
  filteredOptions: IDistributeur[] | undefined;

  displayedColumns: string[] = ['raisonSocial', 'etat','adresse', 'telephone', 'mail', 'actions'];

  dataSource = new MatTableDataSource<IDistributeur>(this.ELEMENTS_TABLE);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  constructor(private translate: TranslateService,private router:Router, private serviceDistributeur:DistributeursService, private _liveAnnouncer: LiveAnnouncer, private serviceService:ServicesService, private serviceTicket:TicketsService,
    private actionsview: PassActionService
  ){ }

  ngOnInit(): void {
    this.actionsview.langueData$.subscribe(data => {
      this.receivedActions$ = this.actionsview.getActions();
      this.receivedActions$.subscribe(a => {
        if (a != null) {
          this.actions = a;
          console.log("Actions view :", a, this.receivedActions$);
        }
      });
    })

    this.getAllDistributeurs().subscribe(valeurs => {
      this.dataSource.data = valeurs;
      this.filteredOptions = valeurs
    });

    this.myControl.valueChanges.subscribe(
      value => {
        const name = typeof value === 'string' ? value : value?.raisonSocial;
        if(name != undefined && name?.length >0){
          this.serviceDistributeur.getDistributeursByraisonSocial(name.toLowerCase() as string).subscribe(
            reponse => {
              this.filteredOptions = reponse;
            }
          )
        }
        else{
          this.serviceDistributeur.getAllDistributeurs().subscribe(
            (resultat) =>{
              this.filteredOptions = resultat
            }
          )
        }

      }
    );
  }


  private getAllDistributeurs(){
    return this.serviceDistributeur.getAllDistributeurs();
  }

  displayFn(user: IDistributeur): string {
    return user && user.raisonSocial ? user.raisonSocial: '';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public rechercherListingDistributeur(option: IDistributeur){
    this.serviceDistributeur.getDistributeursByraisonSocial(option.raisonSocial.toLowerCase()).subscribe(
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

}

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, EMPTY } from 'rxjs';
import { ITicket } from 'src/app/modele/ticket';
import { TicketsService } from 'src/app/services/tickets/tickets.service';

@Component({
  selector: 'app-list-tickets',
  templateUrl: './list-tickets.component.html',
  styleUrls: ['./list-tickets.component.scss']
})
export class ListTicketsComponent implements OnInit {

  tickets$:Observable<ITicket[]>=EMPTY;
  idTicketImpression : string = ""
  
  myControl = new FormControl<string | ITicket>('');
 
  ELEMENTS_TABLE: ITicket[] = [];
  filteredOptions: ITicket[] | undefined;

  displayedColumns: string[] = ['id', 'idUnique', 'date_heure', 'idFileAttente', 'idPersonne', 'statut', 'actions'];
  
  dataSource = new MatTableDataSource<ITicket>(this.ELEMENTS_TABLE);
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private translate: TranslateService, private router:Router, private serviceTicket:TicketsService, private _liveAnnouncer: LiveAnnouncer,) { }

  ngOnInit(): void {
    this.tickets$ = this.getAllTickets();

    this.getAllTickets().subscribe(valeurs => {
      this.dataSource.data = valeurs;
      
    this.myControl.valueChanges.subscribe(
      value => {
        const uniqueId = typeof value === 'string' ? value : value?.idUnique;
        if(uniqueId != undefined && uniqueId?.length >0){
          this.serviceTicket.getTicketByIdUnique(uniqueId.toLowerCase() as string).subscribe(
            reponse => { 
              this.filteredOptions = reponse;
            }
          )
        }
        else{
          this.filteredOptions = [];
        }
        
      }
    );
    });

  }

  displayFn(ticket: ITicket): string {
    return ticket && ticket.idUnique ? ticket.idUnique : '';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public rechercherListingTicket(option: ITicket){
    this.serviceTicket.getTicketByIdUnique(option.idUnique.toLowerCase()).subscribe(
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


  private getAllTickets(){
    return this.serviceTicket.getAllTickets();
  }
}

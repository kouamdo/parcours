import { Component, OnInit, ViewChild } from '@angular/core';
import { IRole } from 'src/app/modele/role';

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
import { RolesService } from 'src/app/services/roles/roles.service';
import { log } from 'console';

@Component({
  selector: 'app-list-roles',
  templateUrl: './list-roles.component.html',
  styleUrls: ['./list-roles.component.scss']
})
export class ListRolesComponent implements OnInit {


  roles$:Observable<IRole[]>=EMPTY;
  services$:Observable<IService[]>=EMPTY;
  tickets$:Observable<ITicket[]>=EMPTY;

  id_role : string = "0";
  id_service : number = 0;
  titre_role : string = "";
  titre_service : string = "";


  myControl = new FormControl<string | IRole>('');

  ELEMENTS_TABLE: IRole[] = [];
  filteredOptions: IRole[] | undefined;

  displayedColumns: string[] = ['titre', 'description', 'etat', 'validations','actions'];

  dataSource = new MatTableDataSource<IRole>(this.ELEMENTS_TABLE);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  tableRoles : any[] = []
  
  
  afficheRoles : any = {
    id: '',
    titre: '',
    description: '',
    validations: [],
    listeValidations: '',
    etat: false
  }

  @ViewChild(MatSort) sort!: MatSort;
  constructor(private translate: TranslateService,private router:Router, private serviceRole:RolesService, private _liveAnnouncer: LiveAnnouncer, private serviceService:ServicesService, private serviceTicket:TicketsService){ }

  ngOnInit(): void {
    this.services$ = this.getAllServices();
    this.tickets$ = this.getAllTickets();

    this.getAllRoles().subscribe(valeurs => {
      const tableRoles : any[] = this.tableRoles
     
      valeurs.forEach(
        x =>{
          this.afficheRoles  = {
            id: x.id,
            titre: x.titre,
            description: x.description,
            etat: x.etat,
            validations: x.validations!,
            listeValidations: ''
          }
          
          if (x.validations) {
            x.validations.forEach(
              m => {
                this.afficheRoles.listeValidations += m.code + ", ";
              } 
            )    
          }
        
          tableRoles.push(this.afficheRoles)
        }
      )
      this.dataSource.data = tableRoles;
    });

    this.myControl.valueChanges.subscribe(
      value => {
        const name = typeof value === 'string' ? value : value?.titre;
        if(name != undefined && name?.length >0){
          this.serviceRole.getRolesBytitre(name.toLowerCase() as string).subscribe(
            reponse => {
              this.filteredOptions = reponse;
            }
          )
        }
        else{
          this.serviceRole.getAllRoles().subscribe(
            (reponse) =>{
              this.filteredOptions=reponse
            }
          )
        }

      }
    );
  }


  private getAllRoles(){
    return this.serviceRole.getAllRoles();
  }

  displayFn(user: IRole): string {
    return user && user.titre ? user.titre: '';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public rechercherListingRole(option: IRole){
    this.serviceRole.getRolesBytitre(option.titre.toLowerCase()).subscribe(
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
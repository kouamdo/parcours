import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { IElements } from 'src/app/modele/elements';
import { IMission } from 'src/app/modele/mission';
import { PassActionService } from 'src/app/services/actions-view/pass-action.service';
import { MissionsService } from 'src/app/services/missions/missions.service';

@Component({
  selector: 'app-list-mission',
  templateUrl: './list-mission.component.html',
  styleUrls: ['./list-mission.component.scss']
})
export class ListMissionComponent implements OnInit {

  missions$:Observable<IMission[]>=EMPTY;
  receivedActions$: Observable<IElements[]>=EMPTY;
  actions : IElements[] | undefined;
  myControl = new FormControl<string | IMission>('');

  ELEMENTS_TABLE: IMission[] = [];
  filteredOptions: IMission[] | undefined;

  displayedColumns: string[] = ['libelle', 'description', 'etat', 'service', 'actions'];

  dataSource = new MatTableDataSource<IMission>(this.ELEMENTS_TABLE);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router:Router, private _liveAnnouncer: LiveAnnouncer, private serviceMission:MissionsService,
    private actionsview: PassActionService
  ) { }

  ngOnInit(): void {
    this.getAllMissions().subscribe(valeurs => {
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
        const libelle = typeof value === 'string' ? value : value?.libelle;
        if(libelle != undefined && libelle?.length >0){
          this.serviceMission.getMissionByLibelle(libelle.toLowerCase() as string).subscribe(
            reponse => {
              this.filteredOptions = reponse;
            }
          )
        }
        else{
          this.serviceMission.getAllMissions().subscribe(
            (reponse) =>{
              this.filteredOptions=reponse
            }
          )
        }

      }
    );
  }

  displayFn(task: IMission): string {
    return task && task.libelle ? task.libelle : '';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public rechercherListingMission(option: IMission){
    this.serviceMission.getMissionByLibelle(option.libelle.toLowerCase()).subscribe(
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
  private getAllMissions(){
    return this.serviceMission.getAllMissions();
  }
}

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { IMission } from 'src/app/modele/mission';
import { MissionsService } from 'src/app/services/missions/missions.service';

@Component({
  selector: 'app-list-mission',
  templateUrl: './list-mission.component.html',
  styleUrls: ['./list-mission.component.scss']
})
export class ListMissionComponent implements OnInit {

  missions$:Observable<IMission[]>=EMPTY;
  myControl = new FormControl<string | IMission>('');

  ELEMENTS_TABLE: IMission[] = [];
  filteredOptions: IMission[] | undefined;

  displayedColumns: string[] = ['libelle', 'description', 'etat', 'service', 'actions'];

  dataSource = new MatTableDataSource<IMission>(this.ELEMENTS_TABLE);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router:Router, private _liveAnnouncer: LiveAnnouncer, private serviceMission:MissionsService) { }

  ngOnInit(): void {
    this.getAllMissions().subscribe(valeurs => {
      this.dataSource.data = valeurs;
    });

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
          this.filteredOptions = [];
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

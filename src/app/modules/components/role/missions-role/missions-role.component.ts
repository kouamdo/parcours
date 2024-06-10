import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { IRole } from 'src/app/modele/role';
import { RolesService } from 'src/app/services/roles/roles.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { IObjetDates } from 'src/app/modele/objet-dates';
import { IMission } from 'src/app/modele/mission';
import { MissionsService } from 'src/app/services/missions/missions.service';
import { VerificationsdatesrolesService } from 'src/app/services/verifications/verificationsdatesroles.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-missions-role',
  templateUrl: './missions-role.component.html',
  styleUrls: ['./missions-role.component.scss'],
})
export class MissionsRoleComponent {
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  myControl = new FormControl<string | IMission>('');
  //personnel$:Observable<personnel>=EMPTY;
  role!: IRole;
  forme: FormGroup;
  titreRole = '';
  textError = '';
  datas: any[] = [];
  ELEMENTS_TABLE: any[] = [];
  VERIF_TABLE: any[] = [];
  filteredOptions: IMission[] | undefined;
  displayedmissionsColumns: string[] = ['selection', 'libelle', 'description', 'service', 'etat'];
  displayedmissionsselectColumns: string[] = [
    'annuler',
    'mission',
    'date debut',
    'date fin',
    'etat',
    'droit ajout',
    'droit modifier',
    'droit consulter',
    'droit de valider'
  ];
  dataSource = new MatTableDataSource<IMission>();
  dataSourceMissionResultat = new MatTableDataSource<any>();
  newdates: IObjetDates | undefined;
  olddates: IObjetDates | undefined;
  idMission: string = '';
  submitted: boolean = false;
  verif: boolean = false;
  modif: boolean = false;
  test: Date | undefined;
  startDate: Date | undefined;
  endDate: Date | undefined;

  constructor(
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private _liveAnnouncer: LiveAnnouncer,
    private verificationsServices: VerificationsdatesrolesService,
    private serviceMission: MissionsService,
    private rolesServices: RolesService,
    private router: Router,
    private infosPath: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    this.forme = this.formBuilder.group({
      dateEntree: ['', Validators.required],
      etat: [0],
      dateFin: [''],
    });
  }

  displayFn(mission: IMission): string {
    return mission && mission.libelle ? mission.libelle : '';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public rechercherListingMission(option: IMission) {
    this.serviceMission
      .getMissionByLibelle(option.libelle.toLowerCase())
      .subscribe((valeurs) => {
        this.dataSource.data = valeurs;
      });
  }

  ngOnInit(): void {
    let idRole = this.infosPath.snapshot.paramMap.get('idRole');

    if (this.forme.value.dateEntree) {
      this.verif = false;
    }

    if (idRole != null && idRole !== '') {
      this.rolesServices.getRoleById(idRole).subscribe((x) => {
        this.role = x;
        this.titreRole = this.role?.titre;
        this.dataSourceMissionResultat.data = this.role?.missions!;
        if (this.role?.missions) {
          this.modif = true;
        }
      });

      this.getAllMissions().subscribe((valeurs) => {
        this.dataSource.data = valeurs;
      });

      this.myControl.valueChanges.subscribe((value) => {
        const name = typeof value === 'string' ? value : value?.libelle;
        if (name != undefined && name?.length > 0) {
          this.serviceMission
            .getMissionByLibelle(name.toLowerCase() as string)
            .subscribe((reponse) => {
              this.filteredOptions = reponse;
            });
        } else {
          this.filteredOptions = [];
        }
      });
    }
  }

  private getAllMissions() {
    return this.serviceMission.getAllMissions();
  }

  get f() {
    return this.forme.controls;
  }

  public checkdroitmission(action: any, element: any, text: string) {
    
    if (action.target.checked) {
      if (text == "add") {
        element.droitDajouter = true
      }
      if (text == "mod") {
        element.droitModifier = true
      }
      if (text == "con") {
        element.droitConsulter = true
      }
      if (text == "val") {
        element.droitDevalider = true
      }
      if (text == "eta") {
        element.etat = true
      }
    } else {
      action.target.checked = false
      if (text == "add") {
        element.droitDajouter = false
      }
      if (text == "mod") {
        element.droitModifier = false
      }
      if (text == "con") {
        element.droitConsulter = false
      }
      if (text == "val") {
        element.droitDevalider = false
      }
      if (text == "eta") {
        element.etat = false
      }
    }   
  }

  /**
   * permet de vérifier qu'une nouvelle date remplit bien les critères d'ajout (pas d'intersection avec une date existante)
   * @param idElement idenfiant de l'élément recherché (role)
   * @param newdates intervalle de dates à vérifier
   * @param indexElement (facultatif) index du tableau à ne pas prendre en compte dans la vérification 
   * @returns true aucune contreindication, false une regle d'intersection est violée
   */
  verificationValeursDate(idElement:String, newdates:IObjetDates, indexElement:number) : boolean {
    var j = 0;
    while (j < this.dataSourceMissionResultat.data.length) {
      if (this.dataSourceMissionResultat.data[j].mission.id == idElement && j != indexElement) {
        
        let olddates : IObjetDates = {
          dateDebut: this.dataSourceMissionResultat.data[j].dateDebut,
          dateFin: this.dataSourceMissionResultat.data[j].dateFin,
        };

        if(!this.verificationsServices.OncheckedDatesRoles(olddates, newdates)) {
          this.textError = "Impossible les intervalles de temps ne sont pas correctes";
          return false;
        }
      }
      j++;
    }
    return true;  
  }

  onCheckMissionChange(event: any, element: IMission) {
    let listIdMissionsTemp: any[] = [];
    if (event.target.checked) {
      if (!listIdMissionsTemp.includes(this.idMission)) {
        this.submitted = true;

        if (this.forme.invalid) {
          event.target.checked = false;
          return;
        }

        let newdates : IObjetDates = {
          dateDebut: this.forme.value.dateEntree,
          dateFin: this.forme.value.dateFin,
        };
        
        if (this.verificationValeursDate(element.id,newdates,-2)) {
          this.ajoutSelectionMission(element);
          this.datas.push({ id: element.id, event: event });
          this.verif=false;
        }
        else{
          event.target.checked = false;
          this.verif = true;
        }
          
      }
    } else {
      let i = 0;
      let res = false;

      while (res == false) {
        if (this.datas[i].id == element.id) {
          this.ELEMENTS_TABLE.splice(i, 1); // je supprime un seul element du tableau a la position 'i'
          this.datas.splice(i, 1);
          res = true;
        }
        i++;
      }
    }
  }

  /**
   * Méthode de vérification des valeurs de dates directement dans le tableau
   * @param element élément du tableau
   * @param event  input html selectionné
   * @param indexElement index de l'élement dans le tableau 
   * @param pos indique si c'est la date de début ou de fin
   */
  verificationModificationDansTableau(element:any, event: any, indexElement: number, pos:String){
    let newdates : IObjetDates = {
      dateDebut: element.dateDebut,
      dateFin: event.target.value
    };

    if (pos == "debut") 
      newdates  = {
        dateDebut: event.target.value,
        dateFin: element.dateFin
      };  

    //si l'utilisateur l'utilisateur supprime la date de début ou la renseigne plus grand que la date fin  
    if(
      (pos == "debut" && event.target.value=='')
      ||
      (newdates.dateFin && (newdates.dateDebut > newdates.dateFin))
      )
    {
      if (pos == "debut") 
         event.target.value = element.dateDebut;
      else 
        event.target.value = element.dateFin;
      return;
    }
    //si une regle non respecté, on remet l'ancienne valeur
    if(!this.verificationValeursDate(element.mission.id, newdates, indexElement)){
      if (pos == "debut") 
        event.target.value = element.dateDebut;
      else 
        event.target.value = element.dateFin;
      this.verif=true;
    }else{
      //si tous les controles ok, on pousse dans le tableau la nouvelle valeur
      if (pos == "debut") 
        this.VERIF_TABLE[indexElement].dateDebut = event.target.value;
      else 
        this.VERIF_TABLE[indexElement].dateFin = event.target.value;
      this.verif=false;
    }   
  }

  retirerSelectionMission(index: number) {
    let temp = this.dataSourceMissionResultat.data;
    temp.splice(index, 1); // je supprime un seul element du tableau a la position 'i'
    this.dataSourceMissionResultat.data = temp;
  }

  validateElement() {
    let tabTemp = this.dataSourceMissionResultat.data;
    this.ELEMENTS_TABLE.forEach((elt) => tabTemp.push(elt));
    this.dataSourceMissionResultat.data = tabTemp;
    this.datas.forEach((c) => (c.event.target.checked = false));
    this.VERIF_TABLE = this.dataSourceMissionResultat.data;
    this.ELEMENTS_TABLE = [];
    this.datas = [];
  }

  annullerElement() {
    this.datas.forEach((c) => (c.event.target.checked = false));
    this.ELEMENTS_TABLE = [];
    this.datas = [];
  }

  ajoutSelectionMission(mission: IMission) {

    this.ELEMENTS_TABLE.push({
      mission: mission,
      etat: false,
      dateDebut: this.forme.value.dateEntree,
      dateFin: this.forme.value.dateFin,
      droitDajouter: false,
      droitModifier: false,
      droitDevalider: false,
      droitConsulter: false,
    });
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

  onSubmit(roleInput: any) {
    this.role.missions = roleInput.filteredData;

    this.rolesServices
      .ajouterRole(this.role)
      .subscribe((object) => {
        this.router.navigate(['/list-roles']);
      });
  }
}
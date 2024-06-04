import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { IPersonnel } from 'src/app/modele/personnel';
import { IRole } from 'src/app/modele/role';
import { PersonnelsService } from 'src/app/services/personnels/personnels.service';
import { RolesService } from 'src/app/services/roles/roles.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { VerificationsdatesrolesService } from 'src/app/services/verifications/verificationsdatesroles.service';
import { IObjetDates } from 'src/app/modele/objet-dates';

@Component({
  selector: 'app-roles-personnel',
  templateUrl: './roles-personnel.component.html',
  styleUrls: ['./roles-personnel.component.scss'],
})
export class RolesPersonnelComponent implements OnInit {
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  myControl = new FormControl<string | IRole>('');
  //personnel$:Observable<personnel>=EMPTY;
  personnel!: IPersonnel;
  forme: FormGroup;
  nomPersonnel = '';
  textError = '';
  datas: any[] = [];
  ELEMENTS_TABLE: any[] = [];
  VERIF_TABLE: any[] = [];
  filteredOptions: IRole[] | undefined;
  displayedColumns: string[] = ['selection', 'titre', 'description', 'etat'];
  displayedrolesColumns: string[] = [
    'annuler',
    'role',
    'date debut',
    'date fin',
  ];
  dataSource = new MatTableDataSource<IRole>();
  dataSourceRoleResultat = new MatTableDataSource<any>();
  idRole: string = '';
  submitted: boolean = false;
  verif: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private _liveAnnouncer: LiveAnnouncer,
    private personnelService: PersonnelsService,
    private verificationsServices: VerificationsdatesrolesService,
    private serviceRole: RolesService,
    private router: Router,
    private infosPath: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    this.forme = this.formBuilder.group({
      dateEntree: ['', Validators.required],
      status: [0],
      dateFin: [''],
    });
  }

  displayFn(role: IRole): string {
    return role && role.titre ? role.titre : '';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public rechercherListingRole(option: IRole) {
    this.serviceRole
      .getRolesBytitre(option.titre.toLowerCase())
      .subscribe((valeurs) => {
        this.dataSource.data = valeurs;
      });
  }

  ngOnInit(): void {
    let idPersonnel = this.infosPath.snapshot.paramMap.get('idPersonnel');

    if (this.forme.value.dateEntree) {
      this.verif = false;
    }

    if (idPersonnel != null && idPersonnel !== '') {
      this.personnelService.getPersonnelById(idPersonnel).subscribe((x) => {
        this.personnel = x;
        this.nomPersonnel = this.personnel?.nom + ' ' + this.personnel?.prenom;
        this.dataSourceRoleResultat.data = this.personnel?.roles!;
      });

      this.getAllRoles().subscribe((valeurs) => {
        this.dataSource.data = valeurs;
        this.filteredOptions = valeurs;
      });

      this.myControl.valueChanges.subscribe((value) => {
        const name = typeof value === 'string' ? value : value?.titre;
        if (name != undefined && name?.length > 0) {
          this.serviceRole
            .getRolesBytitre(name.toLowerCase() as string)
            .subscribe((reponse) => {
              this.filteredOptions = reponse;
            });
        } else {
          this.serviceRole.getAllRoles().subscribe((reponse) => {
            this.filteredOptions = reponse;
          });
        }
      });
    }
  }

  private getAllRoles() {
    return this.serviceRole.getAllRoles();
  }

  get f() {
    return this.forme.controls;
  }

  onCheckRoleChange(event: any, element: IRole) {
    let listIdRolesTemp: any[] = [];
    if (event.target.checked) {
      if (!listIdRolesTemp.includes(this.idRole)) {
        this.submitted = true;

        if (this.forme.invalid) {
          event.target.checked = false;
          return;
        }

        let newdates: IObjetDates = {
          dateDebut: this.forme.value.dateEntree,
          dateFin: this.forme.value.dateFin,
        };

        if (this.verificationValeursDate(element.id, newdates, -2)) {
          this.ajoutSelectionRole(element);
          this.datas.push({ id: element.id, event: event });
          this.verif = false;
        } else {
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
   * permet de vérifier qu'une nouvelle date remplit bien les critères d'ajout (pas d'intersection avec une date existante)
   * @param idElement idenfiant de l'élément recherché (role)
   * @param newdates intervalle de dates à vérifier
   * @param indexElement (facultatif) index du tableau à ne pas prendre en compte dans la vérification
   * @returns true aucune contreindication, false une regle d'intersection est violée
   */
  verificationValeursDate(
    idElement: String,
    newdates: IObjetDates,
    indexElement: number
  ): boolean {
    var j = 0;
    while (j < this.dataSourceRoleResultat.data.length) {
      if (
        this.dataSourceRoleResultat.data[j].role.id == idElement &&
        j != indexElement
      ) {
        let olddates: IObjetDates = {
          dateDebut: this.dataSourceRoleResultat.data[j].dateDebut,
          dateFin: this.dataSourceRoleResultat.data[j].dateFin,
        };

        if (
          !this.verificationsServices.OncheckedDatesRoles(olddates, newdates)
        ) {
          this.textError =
            'Impossible les intervalles de temps ne sont pas correctes';
          return false;
        }
      }
      j++;
    }
    return true;
  }

  /**
   * Méthode de vérification des valeurs de dates directement dans le tableau
   * @param element élément du tableau
   * @param event  input html selectionné
   * @param indexElement index de l'élement dans le tableau
   * @param pos indique si c'est la date de début ou de fin
   */
  verificationModificationDansTableau(
    element: any,
    event: any,
    indexElement: number,
    pos: String
  ) {
    let newdates: IObjetDates = {
      dateDebut: element.dateDebut,
      dateFin: event.target.value,
    };

    if (pos == 'debut')
      newdates = {
        dateDebut: event.target.value,
        dateFin: element.dateFin,
      };

    //si l'utilisateur l'utilisateur supprime la date de début ou la renseigne plus grand que la date fin
    if (
      (pos == 'debut' && event.target.value == '') ||
      (newdates.dateFin && newdates.dateDebut > newdates.dateFin)
    ) {
      if (pos == 'debut') event.target.value = element.dateDebut;
      else event.target.value = element.dateFin;
      return;
    }
    //si une regle non respecté, on remet l'ancienne valeur
    if (
      !this.verificationValeursDate(element.role.id, newdates, indexElement)
    ) {
      if (pos == 'debut') event.target.value = element.dateDebut;
      else event.target.value = element.dateFin;
      this.verif = true;
    } else {
      //si tous les controles ok, on pousse dans le tableau la nouvelle valeur
      if (pos == 'debut')
        this.VERIF_TABLE[indexElement].dateDebut = event.target.value;
      else this.VERIF_TABLE[indexElement].dateFin = event.target.value;
      this.verif = false;
    }
  }

  retirerSelectionRole(index: number) {
    let temp = this.dataSourceRoleResultat.data;
    temp.splice(index, 1); // je supprime un seul element du tableau a la position 'i'
    this.dataSourceRoleResultat.data = temp;
  }

  validateElement() {
    let tabTemp = this.dataSourceRoleResultat.data;
    this.ELEMENTS_TABLE.forEach((elt) => tabTemp.push(elt));
    this.dataSourceRoleResultat.data = tabTemp;
    this.datas.forEach((c) => (c.event.target.checked = false));
    this.VERIF_TABLE = this.dataSourceRoleResultat.data;
    this.ELEMENTS_TABLE = [];
    this.datas = [];
  }

  annullerElement() {
    this.datas.forEach((c) => (c.event.target.checked = false));
    this.ELEMENTS_TABLE = [];
    this.datas = [];
  }

  ajoutSelectionRole(rol: IRole) {
    this.ELEMENTS_TABLE.push({
      role: rol,
      status: false,
      dateDebut: this.forme.value.dateEntree,
      dateFin: this.forme.value.dateFin,
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

  onSubmit(personnelInput: any) {
    this.personnel.roles = personnelInput.filteredData;

    this.personnelService
      .ajouterPersonnel(this.personnel)
      .subscribe((object) => {
        this.router.navigate(['/list-personnels']);
      });
  }
}

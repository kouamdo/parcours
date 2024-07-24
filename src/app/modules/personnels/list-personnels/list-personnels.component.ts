import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IPersonnel } from 'src/app/modele/personnel';
import { ModalCodebarreService } from '../../shared/modal-codebarre/modal-codebarre.service';
import { ModalCodebarreScanContinueComponent } from '../../shared/modal-codebarre-scan-continue/modal-codebarre-scan-continue.component';
import { UtilisateurService } from 'src/app/services/utilisateurs/utilisateur.service';
import { IUtilisateurs } from 'src/app/modele/utilisateurs';
import { MatDialog } from '@angular/material/dialog';
import { ModalChoixGroupsComponent } from '../../shared/modal-choix-groups/modal-choix-groups.component';
import { AuthentificationService } from 'src/app/services/authentifications/authentification.service';
import { IElements } from 'src/app/modele/elements';
import { PassActionService } from 'src/app/services/actions-view/pass-action.service';
import { Observable, EMPTY } from 'rxjs';

@Component({
  selector: 'app-list-personnels',
  templateUrl: './list-personnels.component.html',
  styleUrls: ['./list-personnels.component.scss'],
})
export class ListPersonnelsComponent implements OnInit, AfterViewInit {
  @ViewChild('barcodeScanner', { static: false })
  barcodeScanner!: ModalCodebarreScanContinueComponent;

  myControl = new FormControl<string | IPersonnel>('');
  @Input()
  langue :string = localStorage.getItem('langue')!;

  ELEMENTS_TABLE: IUtilisateurs[] = [];
  filteredOptions: IUtilisateurs[] | undefined;
  user : IUtilisateurs | undefined;
  receivedActions$: Observable<IElements[]>=EMPTY;
  actions : IElements[] | undefined;

  displayedColumns: string[] = [
    'nom',
    'prenom',
    'dateNaissance',
    'sexe',
    'email',
    'telephone',
    'groupe',
    'dateEntree',
    'dateSortie',
    'actions',
  ];

  dataSource = new MatTableDataSource<IUtilisateurs>(this.ELEMENTS_TABLE);

  formPersonnel: FormGroup;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialogDef : MatDialog,
    public authService: AuthentificationService,
    private _liveAnnouncer: LiveAnnouncer,
    private barService: ModalCodebarreService,
    private userService: UtilisateurService,
    private actionsview: PassActionService
  ) {
    this.formPersonnel = this.formBuilder.group({
      _listPersonnels: new FormArray([]),
    });
  }

  private getAllPersonnels() {
    return this.userService.getAllUtilisateurs();
  }

  displayFn(user: IPersonnel): string {
    return user && user.nom ? user.nom : '';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public rechercherListingPersonnel(option: IUtilisateurs) {
    this.userService
      .getUsersByName(option.user.nom.toLowerCase())
      .subscribe((valeurs) => {
        this.dataSource.data = valeurs;
      });
  }

  scan_val: any | undefined;

  openBarcodeScanner(): void {
    console.log('Attempting to open barcode scanner');
    if (this.barcodeScanner) {
      console.log('barcodeScanner initialized');
      this.barcodeScanner.createMediaStream(); // Make sure to use parentheses to call the function
    } else {
      console.log('barcodeScanner is undefined in AfterViewInit');
    }
  }

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
    
    this.barService.getCode().subscribe((dt) => {
      this.scan_val = dt;
      this.myControl.setValue(this.scan_val); // Set the initial value in the search bar

      if (this.scan_val) {
        // If scan_val is set, perform a search to get the corresponding libelle
        this.userService
          .getUsersByNameOrId(this.scan_val)
          .subscribe((response) => {
            this.filteredOptions = response;
            const selectedOption = this.filteredOptions.find(
              (option) => option.id === this.scan_val
            );
            if (selectedOption) {
              this.filteredOptions = [selectedOption];
              this.dataSource.data = [selectedOption];
            }
          });
      }
    });

    this.getAllPersonnels().subscribe((valeurs) => {
      this.dataSource.data = valeurs;
      this.filteredOptions = valeurs;
    });

    this.myControl.valueChanges.subscribe((value) => {
      const query = value?.toString().toLowerCase(); // Convert to lower case for case-insensitive search
      if (query && query.length > 0) {
        // Search by name or ID
        this.userService
          .getUsersByNameOrId(query)
          .subscribe((reponse) => {
            this.filteredOptions = reponse;
          });
      } else {
        this.filteredOptions = [];
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("Actions view  not:", this.receivedActions$);

    if (changes['langueParent']) {
      this.receivedActions$ = this.actionsview.getActions();
      console.log("Actions view yes:", this.receivedActions$);
    }
  }

  openChoixGroupDialog(personnel: IPersonnel){
    const dialogRef = this.dialogDef.open(ModalChoixGroupsComponent,
    {
      maxWidth: '100%',
      maxHeight: '100%',
      width:'100%',
      height:'100%',
      enterAnimationDuration:'1000ms',
      exitAnimationDuration:'1000ms',
      data:{personnel}
    }
    )

    dialogRef.afterClosed().subscribe(result => { 
      this.getAllPersonnels().subscribe((valeurs) => {
        this.dataSource.data = valeurs;
        this.filteredOptions = valeurs;
      console.log("result:", result, valeurs);
      });    
      this.router.navigate([this.router.url]);
      
    });
    
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}

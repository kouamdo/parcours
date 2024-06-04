import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IPersonnel } from 'src/app/modele/personnel';
import { PersonnelsService } from 'src/app/services/personnels/personnels.service';
import { Observable } from 'rxjs';
import { ModalCodebarreService } from '../../shared/modal-codebarre/modal-codebarre.service';
import { ModalCodebarreScanContinueComponent } from '../../shared/modal-codebarre-scan-continue/modal-codebarre-scan-continue.component';

@Component({
  selector: 'app-list-personnels',
  templateUrl: './list-personnels.component.html',
  styleUrls: ['./list-personnels.component.scss'],
})
export class ListPersonnelsComponent implements OnInit, AfterViewInit {
  @ViewChild('barcodeScanner', { static: false })
  barcodeScanner!: ModalCodebarreScanContinueComponent;

  myControl = new FormControl<string | IPersonnel>('');

  ELEMENTS_TABLE: IPersonnel[] = [];
  filteredOptions: IPersonnel[] | undefined;

  displayedColumns: string[] = [
    'nom',
    'prenom',
    'dateNaissance',
    'sexe',
    'email',
    'telephone',
    'dateEntree',
    'dateSortie',
    'actions',
  ];

  dataSource = new MatTableDataSource<IPersonnel>(this.ELEMENTS_TABLE);

  formPersonnel: FormGroup;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private servicePersonnel: PersonnelsService,
    private formBuilder: FormBuilder,
    private _liveAnnouncer: LiveAnnouncer,
    private barService: ModalCodebarreService
  ) {
    this.formPersonnel = this.formBuilder.group({
      _listPersonnels: new FormArray([]),
    });
  }

  private getAllPersonnels() {
    return this.servicePersonnel.getAllPersonnels();
  }

  displayFn(user: IPersonnel): string {
    return user && user.nom ? user.nom : '';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public rechercherListingPersonnel(option: IPersonnel) {
    this.servicePersonnel
      .getPersonnelsByName(option.nom.toLowerCase())
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
    this.barService.getCode().subscribe((dt) => {
      this.scan_val = dt;
      this.myControl.setValue(this.scan_val); // Set the initial value in the search bar

      if (this.scan_val) {
        // If scan_val is set, perform a search to get the corresponding libelle
        this.servicePersonnel
          .getPersonelsByNameOrId(this.scan_val)
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
        this.servicePersonnel
          .getPersonelsByNameOrId(query)
          .subscribe((reponse) => {
            this.filteredOptions = reponse;
          });
      } else {
        this.filteredOptions = [];
      }
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

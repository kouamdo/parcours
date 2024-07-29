import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, Observable } from 'rxjs';
import { Promo } from 'src/app/modele/promo-distributeur';
import { PromoService } from 'src/app/services/promo/promo.service';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { PassActionService } from 'src/app/services/actions-view/pass-action.service';
import { IElements } from 'src/app/modele/elements';

@Component({
  selector: 'app-list-promo',
  templateUrl: './list-promo.component.html',
  styleUrls: ['./list-promo.component.scss']
})
export class ListPromoComponent implements OnInit, AfterViewInit {

  promos$: Observable<Promo[]> = EMPTY;
  myControl = new FormControl<string | Promo>('');
  ELEMENTS_TABLE: Promo[] = [];
  filteredOptions: Promo[] | undefined;
  receivedActions$: Observable<IElements[]>=EMPTY;
  actions : IElements[] | undefined;

  displayedColumns: string[] = ['emetteur', 'dateDebut', 'dateFin', 'codeUnique', 'montantRemise', 'pourcentageRemise', 'famille', 'ressource', 'actions'];
  dataSource = new MatTableDataSource<Promo>(this.ELEMENTS_TABLE);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private promoService: PromoService,
    private _liveAnnouncer: LiveAnnouncer,
    private actionsview: PassActionService
  ) {}

  ngOnInit(): void {
    this.getAllPromos().subscribe(valeurs => {
      this.dataSource.data = valeurs;
      this.filteredOptions = valeurs;
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

    this.myControl.valueChanges.subscribe(value => {
      const codeUnique = typeof value === 'string' ? value : value?.codeUnique;
      if (codeUnique !== undefined && codeUnique?.length > 0) {
        this.promoService.getPromosByCodeUnique(codeUnique.toLowerCase()).subscribe(reponse => {
          this.filteredOptions = reponse;
        });
      } else {
        this.promoService.getAllPromos().subscribe(reponse => {
          this.filteredOptions = reponse;
        });
      }
    });
  }

  private getAllPromos(): Observable<Promo[]> {
    return this.promoService.getAllPromos();
  }

  displayFn(promo: Promo): string {
    return promo && promo.codeUnique ? promo.codeUnique : '';
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public rechercherListingPromo(option: Promo): void {
    this.promoService.getPromosByCodeUnique(option.codeUnique.toLowerCase()).subscribe(valeurs => {
      this.dataSource.data = valeurs;
    });
  }

  isLastElement(array: any[], element: any): boolean {
    return array.indexOf(element) === array.length - 1;
  }
  

  announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}

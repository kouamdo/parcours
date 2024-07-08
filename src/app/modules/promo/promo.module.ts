import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NewPromoComponent } from './new-promo/new-promo.component';
import { ListPromoComponent } from './list-promo/list-promo.component';
import { PromoRoutingModule } from './promo-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpLoaderFactory } from 'src/app/app.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    NewPromoComponent,
    ListPromoComponent
  ],
  imports: [
    CommonModule,
    PromoRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    SharedModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      extend: true,
    }),
    MatSelectModule,
    MatCheckboxModule,
  ],
  providers: [DatePipe],
})
export class PromoModule { }

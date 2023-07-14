import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PrecoMvtRoutingModule } from './precomvt-routing.module';
import { NewPrecomvtComponent } from './new-precomvt/new-precomvt.component';

import { AppRoutingModule } from 'src/app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';
import { TicketsModule } from '../tickets/tickets.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ListPrecomvtsComponent } from './list-precomvts/list-precomvts.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    NewPrecomvtComponent,
    ListPrecomvtsComponent
  ],
  imports: [
    CommonModule,
    PrecoMvtRoutingModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    TicketsModule,
    TranslateModule.forChild({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        },
        extend:true
    }),
    BrowserModule
  ],
  providers: [DatePipe],
})
export class PrecomvtModule { }

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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { ViewPrecomvtComponent } from './view-precomvt/view-precomvt.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    NewPrecomvtComponent,
    ListPrecomvtsComponent,
    ViewPrecomvtComponent
  ],
  exports: [
    ViewPrecomvtComponent
  ],
  imports: [
    CommonModule,
    PrecoMvtRoutingModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatSelectModule,
    MatCheckboxModule,
    TicketsModule,
    MatDialogModule,
    SharedModule,
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

import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { DocumentsRoutingModule } from './documents-routing.module';
import { NewFormDocumentComponent } from './new-form-document/new-form-document.component';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { HttpLoaderFactory } from 'src/app/app.module';
import { ListFormDocumentComponent } from './list-form-document/list-form-document.component';
import { ViewFormDocumentComponent } from './view-form-document/view-form-document.component';
import { SharedModule } from '../shared/shared.module';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    NewFormDocumentComponent,
    ListFormDocumentComponent,
    ViewFormDocumentComponent
  ],
  imports: [
    CommonModule,
    DocumentsRoutingModule,
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
export class DocumentsModule { }

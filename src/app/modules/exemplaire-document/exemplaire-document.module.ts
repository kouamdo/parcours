import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExemplaireDocumentRoutingModule } from './exemplaire-document-routing.module';
import { NewExemplaireComponent } from './new-exemplaire/new-exemplaire.component';
import { ViewExemplaireComponent } from './view-exemplaire/view-exemplaire.component';
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
import { ListExemplaireComponent } from './list-exemplaire/list-exemplaire.component';
import { SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [
    NewExemplaireComponent,
    ViewExemplaireComponent,
    ListExemplaireComponent,
  ],
  imports: [
    CommonModule,
    ExemplaireDocumentRoutingModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    SharedModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      extend: true,
    }),
    BrowserModule,
  ],
})
export class ExemplaireDocumentModule {}

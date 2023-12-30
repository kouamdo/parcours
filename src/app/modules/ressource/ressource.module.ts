import { NgModule } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { RessourceRoutingModule } from './ressource-routing.module';
import { NewRessourceComponent } from './new-ressource/new-ressource.component';

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
import { HttpLoaderFactory } from 'src/app/app.module';
import { ListRessourcesComponent } from './list-ressources/list-ressources.component';
import { SharedModule } from '../shared/shared.module';
import { MatSelectModule } from '@angular/material/select';




@NgModule({
  declarations: [
    NewRessourceComponent,
    ListRessourcesComponent,
  ],
  imports: [
    CommonModule,
    RessourceRoutingModule,

    FormsModule,
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
export class RessourceModule { }

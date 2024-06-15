import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EtatsRoutingModule } from './etats-routing.module';
import { NewEtatComponent } from './new-etat/new-etat.component';
import { ViewEtatComponent } from './view-etat/view-etat.component';
import { ListEtatsComponent } from './list-etats/list-etats.component';
import { HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '../shared/shared.module';
import { ModulesRoutingModule } from '../modules-routing.module';


@NgModule({
  declarations: [
    NewEtatComponent,
    ViewEtatComponent,
    ListEtatsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ModulesRoutingModule,
    ReactiveFormsModule,
    EtatsRoutingModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatTableModule,
    SharedModule,
    MatSortModule,
    TranslateModule.forChild({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        },
        extend:true
    })
  ]
})
export class EtatsModule { }

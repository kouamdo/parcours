import { NgModule } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { RessourceRoutingModule } from './ressource-routing.module';
import { NewRessourceComponent } from './new-ressource/new-ressource.component';

import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { ListRessourcesComponent } from './list-ressources/list-ressources.component';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '../shared/shared.module';
import { ModulesRoutingModule } from '../modules-routing.module';


@NgModule({
  declarations: [
    NewRessourceComponent,
    ListRessourcesComponent,
  ],
  exports:[NewRessourceComponent, ListRessourcesComponent],
  imports: [
    CommonModule,
    RessourceRoutingModule,
    SharedModule,
    FormsModule,
    ModulesRoutingModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    //MatFormFieldModule,
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
    })
  ],
  providers: [DatePipe],
})
export class RessourceModule { }

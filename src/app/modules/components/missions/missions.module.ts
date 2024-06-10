import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MissionsRoutingModule } from './missions-routing.module';
import { ListMissionComponent } from './list-mission/list-mission.component';
import { NewMissionComponent } from './new-mission/new-mission.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { ExecuterMissionComponent } from './executer-mission/executer-mission.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SharedModule } from '../shared/shared.module';
import { ModulesRoutingModule } from '../../modules-routing.module';


@NgModule({
  declarations: [
    ListMissionComponent,
    NewMissionComponent,
    ExecuterMissionComponent
  ],
  imports: [
    CommonModule,
    MissionsRoutingModule,
    FormsModule,
    ModulesRoutingModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatSelectModule,
    MatCheckboxModule,
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
export class MissionsModule { }

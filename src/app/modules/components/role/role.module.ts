import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { RoleRoutingModule } from './role-routing.module';
import { NewRoleComponent } from './new-role/new-role.component';
import { ListRolesComponent } from './list-roles/list-roles.component';

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
import { MatSelectModule } from '@angular/material/select';
import { MissionsRoleComponent } from './missions-role/missions-role.component';
import { ModulesRoutingModule } from '../../modules-routing.module';


@NgModule({
  declarations: [
    NewRoleComponent,
    ListRolesComponent,
    MissionsRoleComponent
  ],
  imports: [
    CommonModule,
    RoleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    ModulesRoutingModule,
    MatTableModule,
    MatSortModule,
    MatSelectModule,
    TicketsModule,
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
export class RoleModule { }
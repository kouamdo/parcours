import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ParoursRoutingModule } from './parours-routing.module';
import { NewParoursComponent } from './new-parours/new-parours.component';
import { ListParoursComponent } from './list-parours/list-parours.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { TicketsModule } from '../tickets/tickets.module';
import { SharedModule } from '../shared/shared.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EtapeModule } from '../etape/etape.module';
import { ModulesRoutingModule } from '../modules-routing.module';

@NgModule({
  declarations: [NewParoursComponent, ListParoursComponent],
  imports: [
    CommonModule,
    ParoursRoutingModule,
    FormsModule,
    ModulesRoutingModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    TicketsModule,
    SharedModule,
    EtapeModule,
    MatSelectModule,
    MatCheckboxModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      extend: true,
    })
  ],
  providers: [DatePipe],
})
export class ParoursModule {}

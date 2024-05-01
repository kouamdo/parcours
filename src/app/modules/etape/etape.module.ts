import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

//import { EtapeRoutingModule } from './etape-routing.module';
import { NewEtapeComponent } from './new-etape/new-etape.component';
import { ListEtapesComponent } from './list-etapes/list-etapes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from 'src/app/app-routing.module';
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
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [NewEtapeComponent, ListEtapesComponent],
  imports: [
    CommonModule,
    //EtapeRoutingModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    TicketsModule,
    SharedModule,
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
  exports: [ListEtapesComponent],
  providers: [DatePipe],
})
export class EtapeModule {}

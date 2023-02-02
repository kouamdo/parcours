import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketsRoutingModule } from './tickets-routing.module';
import { ListTicketsComponent } from './list-tickets/list-tickets.component';
import { NewTicketComponent } from './new-ticket/new-ticket.component';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { HttpLoaderFactory } from 'src/app/app.module';
import { TicketCourantComponent } from './ticket-courant/ticket-courant.component';
import { PanneauTicketComponent } from './panneau-ticket/panneau-ticket.component';


@NgModule({
  declarations: [
    ListTicketsComponent,
    NewTicketComponent,
    TicketCourantComponent,
    PanneauTicketComponent
  ],
  imports: [
    CommonModule,
    TicketsRoutingModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
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
  exports: [
    NewTicketComponent,
    TicketCourantComponent
  ]
})
export class TicketsModule { }

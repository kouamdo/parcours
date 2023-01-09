import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewPatientComponent } from './new-patient/new-patient.component';
import { ListPatientsComponent } from './list-patients/list-patients.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';
import { TicketsModule } from '../tickets/tickets.module';



@NgModule({
  declarations: [
    NewPatientComponent,
    ListPatientsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    TicketsModule,
    TranslateModule.forChild({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        },
        extend:true
    }),
    BrowserModule 
  ]
})
export class PatientsModule { }

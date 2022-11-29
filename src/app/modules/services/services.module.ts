import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicesRoutingModule } from './services-routing.module';
import { ListServicesComponent } from './list-services/list-services.component';
import { NewServicesComponent } from './new-services/new-services.component';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { HttpLoaderFactory } from 'src/app/app.module';


@NgModule({
  declarations: [
    ListServicesComponent,
    NewServicesComponent
  ],
  imports: [
    CommonModule,
    ServicesRoutingModule,
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
  ]
})
export class ServicesModule { }

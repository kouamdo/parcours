import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicesRoutingModule } from './services-routing.module';
import { ListServicesComponent } from './list-services/list-services.component';
import { NewServicesComponent } from './new-services/new-services.component';


@NgModule({
  declarations: [
    ListServicesComponent,
    NewServicesComponent
  ],
  imports: [
    CommonModule,
    ServicesRoutingModule
  ]
})
export class ServicesModule { }

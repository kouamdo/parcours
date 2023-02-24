import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttributsRoutingModule } from './modules/attributs/attributs-routing.module';
import { MissionsRoutingModule } from './modules/missions/missions-routing.module';
import { PatientsRoutingModule } from './modules/patients/patient-routing.module';
import { ServicesRoutingModule } from './modules/services/services-routing.module';
import { TicketsRoutingModule } from './modules/tickets/tickets-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [
    PatientsRoutingModule, 
    RouterModule.forRoot(routes), 
    ServicesRoutingModule, 
    TicketsRoutingModule, 
    AttributsRoutingModule,
    MissionsRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

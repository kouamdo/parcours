import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuRoutingModule } from './modules/menu/menu-routing.module';
import { PatientsRoutingModule } from './modules/patients/patient-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [PatientsRoutingModule, RouterModule.forRoot(routes), MenuRoutingModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }

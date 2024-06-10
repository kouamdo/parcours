import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListServicesComponent } from './list-services/list-services.component';
import { NewServicesComponent } from './new-services/new-services.component';

const routes: Routes = [
  {
    path: 'service-nouveau',
    title: 'Enregistrer un nouveau service',
    component: NewServicesComponent
  },
  {
    path: 'service-nouveau/:idService',
    title: 'Modifier un service',
    component: NewServicesComponent
  },
  {
    path: 'list-services',
    title: 'Recherche de services',
    component: ListServicesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule { }

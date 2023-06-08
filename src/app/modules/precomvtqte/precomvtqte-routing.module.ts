import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewPrecomvtqteComponent } from './new-precomvtqte/new-precomvtqte.component';
import { ListPrecomvtqtesComponent } from './list-precomvtqtes/list-precomvtqtes.component';

const routes = [
  {
    path: 'precomvtqte-nouvelle',
    title: 'Enregistrer une nouvelle precomvtqte',
    component: NewPrecomvtqteComponent
  },
  {
    path: 'precomvtqte-nouvelle/:idPrecomvtqte',
    title: 'Modifier une precomvtqte',
    component:NewPrecomvtqteComponent
  },
  {
    path: 'list-precomvtqtes',
    title: 'Rechercher une precomvtqte',
    component: ListPrecomvtqtesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrecomvtqteRoutingModule { }

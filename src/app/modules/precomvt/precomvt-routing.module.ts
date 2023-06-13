import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewPrecomvtComponent } from './new-precomvt/new-precomvt.component';
import { ListPrecomvtsComponent } from './list-precomvts/list-precomvts.component';

const routes: Routes = [

  {
    path: 'precomvt-nouvelle',
    title: 'Enregistrer une nouvelle precomvt',
    component: NewPrecomvtComponent
  },
  {
    path: 'precomvt-nouvelle/:idprecomvt',
    title: 'Modifier une famille',
    component: NewPrecomvtComponent
  },
  {
    path: 'list-precomvts',
    title: 'Recherche de precomvts',
    component: ListPrecomvtsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrecomvtRoutingModule { }

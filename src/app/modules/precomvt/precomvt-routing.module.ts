import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewPrecomvtComponent } from './new-precomvt/new-precomvt.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrecomvtRoutingModule { }

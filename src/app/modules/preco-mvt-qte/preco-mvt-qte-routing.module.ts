import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewPrecomvtqteComponent } from './new-precomvtqte/new-precomvtqte.component';

const routes: Routes = [
  {
    path: 'PrecoMvtQte-nouvelle',
    title: 'Enregistrer une nouvelle precomvtqte',
    component: NewPrecomvtqteComponent
  },
  {
    path: 'PrecoMvtQte-nouvelle',
    title: 'Modifier une precomvtqte',
    component: NewPrecomvtqteComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrecoMvtQteRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewParoursComponent } from './new-parours/new-parours.component';
import { ListParoursComponent } from './list-parours/list-parours.component';
import { NewEtapeComponent } from '../etape/new-etape/new-etape.component';

const routes = [
  {
    path: 'nouveau-parours',
    title: 'Enregistrer un nouveau parcours',
    component: NewParoursComponent,
  },
  {
    path: 'nouveau-parours/:idParours',
    title: 'Modifier un parcours',
    component: NewParoursComponent,
  },
  {
    path: 'list-parours',
    title: 'Recherche de parcours',
    component: ListParoursComponent,
  },
  {
    path: 'nouvelle-etape',
    title: 'creer une etape',
    component: NewEtapeComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParoursRoutingModule {}

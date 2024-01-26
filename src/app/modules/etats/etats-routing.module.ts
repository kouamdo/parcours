import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListEtatsComponent } from './list-etats/list-etats.component';
import { NewEtatComponent } from './new-etat/new-etat.component';

const routes: Routes = [
  {
    path: 'etat-nouveau',
    title: 'Creer un nouvel etat',
    component: NewEtatComponent
  },
  {
    path: 'etat-nouveau/:idEtat',
    title: 'Modifier un etat',
    component: NewEtatComponent
  },
  {
    path: 'list-etats',
    title: 'Recherche des etats',
    component: ListEtatsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtatsRoutingModule { }

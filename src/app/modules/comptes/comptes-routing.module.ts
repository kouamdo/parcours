import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComptesComponent } from './list-comptes/list-comptes.component';
import { NewCompteComponent } from './new-compte/new-compte.component';

const routes: Routes = [
  {
    path: 'compte-nouveau',
    title: 'Creer un nouvel compte',
    component: NewCompteComponent
  },
  {
    path: 'compte-nouveau/:idCompte',
    title: 'Modifier un compte',
    component: NewCompteComponent
  },
  {
    path: 'list-comptes',
    title: 'Recherche de comptes',
    component: ListComptesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComptesRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NewDistributeurComponent } from "./new-distributeur/new-distributeur.component";
import { ListDistributeursComponent } from './list-distributeurs/list-distributeurs.component';

const routes= [
  {
    path: 'distributeur-nouveau',
    title: 'Enregistrer un nouveau distributeur',
    component: NewDistributeurComponent
  },
  {
    path: 'distributeur-nouveau/:idDistributeur',
    title: 'Modifier un distributeur',
    component: NewDistributeurComponent
  },
  {
    path: 'list-distributeurs',
    title: 'Recherche de distributeurs',
    component: ListDistributeursComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DistributeurRoutingModule { }

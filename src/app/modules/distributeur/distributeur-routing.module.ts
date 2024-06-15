import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewDistributeurComponent } from "./new-distributeur/new-distributeur.component";
import { ListDistributeursComponent } from './list-distributeurs/list-distributeurs.component';
import { CommonModule } from '@angular/common';

const routesDistributeurs: Routes = [
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
  imports: [
    CommonModule,
    RouterModule.forChild(routesDistributeurs)
  ],
  exports: [RouterModule]
})
export class DistributeurRoutingModule { }

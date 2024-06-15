import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewFamilleComponent } from "./new-famille/new-famille.component";
import { ListFamillesComponent } from './list-familles/list-familles.component';
import { CommonModule } from '@angular/common';

const routesFamilles: Routes =[
  {
    path: 'famille-nouvelle',
    title: 'Enregistrer une nouvelle famille',
    component: NewFamilleComponent
  },
  {
    path: 'famille-nouvelle/:idFamille',
    title: 'Modifier une famille',
    component: NewFamilleComponent
  },
  {
    path: 'list-familles',
    title: 'Recherche de familles',
    component: ListFamillesComponent
  }

];
@NgModule({
    imports: [RouterModule.forChild(routesFamilles), CommonModule],
    exports: [RouterModule]
})
export class FamilleRoutingModule{}

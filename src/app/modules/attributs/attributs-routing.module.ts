import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListAttributsComponent } from './list-attributs/list-attributs.component';
import { NewAttributComponent } from './new-attribut/new-attribut.component';
import { CommonModule } from '@angular/common';


const routesAttributs: Routes = [
  
      {
        path: 'attribut-nouveau',
        title: 'Creer un nouvel attribut',
        component: NewAttributComponent
      },
      {
        path: 'attribut-nouveau/:idAttribut',
        title: 'Modifier un attribut',
        component: NewAttributComponent
      },
      {
        path: 'list-attributs',
        title: 'Recherche de attributs',
        component: ListAttributsComponent
      }

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routesAttributs)],
  exports: [RouterModule]
})
export class AttributsRoutingModule{}

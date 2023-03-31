import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListAttributsComponent } from './list-attributs/list-attributs.component';
import { NewAttributComponent } from './new-attribut/new-attribut.component';

const routes: Routes = [
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
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttributsRoutingModule { }

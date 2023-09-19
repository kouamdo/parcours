import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewPersonnelComponent } from './new-personnel/new-personnel.component';
import { ListPersonnelsComponent } from './list-personnels/list-personnels.component';

const routes= [

  {
    path: 'nouveau-personnel',
    title: 'Enregistrer un nouveau personnel',
    component: NewPersonnelComponent
  },
  {
    path: 'update-personnel/:IPersonnel',
    title: 'Modifier un personnel',
    component: NewPersonnelComponent
  },
  {
    path: 'list-personnels',
    title: 'Afficher le personnel de la clinique',
    component: ListPersonnelsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonnelsRoutingModule { }

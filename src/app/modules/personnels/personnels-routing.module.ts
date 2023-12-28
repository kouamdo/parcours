import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewPersonnelComponent } from './new-personnel/new-personnel.component';
import { ListPersonnelsComponent } from './list-personnels/list-personnels.component';
import { RolesPersonnelComponent } from './roles-personnel/roles-personnel.component';

const routes= [

  {
    path: 'nouveau-personnel',
    title: 'Enregistrer un nouveau personnel',
    component: NewPersonnelComponent
  },
  {
    path: 'update-personnel/:idPersonnel',
    title: 'Modifier un personnel',
    component: NewPersonnelComponent
  },
  {
    path: 'list-personnels',
    title: 'Afficher le personnel de la clinique',
    component: ListPersonnelsComponent
  },
  {
    path: 'affecte-role-personnel/:idPersonnel',
    title: 'Affecter un ou plusieurs roles a un personnel',
    component: RolesPersonnelComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonnelsRoutingModule { }

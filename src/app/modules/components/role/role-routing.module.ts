import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewRoleComponent } from './new-role/new-role.component';
import { ListRolesComponent } from './list-roles/list-roles.component';
import { MissionsRoleComponent } from './missions-role/missions-role.component';

const routes= [
  {
    path: 'role-nouveau',
    title: 'Enregistrer un nouveau role',
    component: NewRoleComponent
  },
  {
    path: 'role-nouveau/:idRole',
    title: 'Modifier un role',
    component: NewRoleComponent
  },
  {
    path: 'list-roles',
    title: 'Recherche de roles',
    component: ListRolesComponent
  },
  {
    path: 'affecte-mission-role/:idRole',
    title: 'Affecter un ou plusieurs missions a un role',
    component: MissionsRoleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }
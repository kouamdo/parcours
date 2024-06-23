import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExecuterMissionComponent } from './executer-mission/executer-mission.component';
import { ListMissionComponent } from './list-mission/list-mission.component';
import { NewMissionComponent } from './new-mission/new-mission.component';
import { CommonModule } from '@angular/common';
import { RoleAuthGuard } from 'src/app/verify-users/role-users/role-auth.guard';

const routesMissions: Routes = [
  {
    path: 'mission-nouveau',
    title: 'Creer un nouvel mission',
    component: NewMissionComponent,
    canActivate: [RoleAuthGuard],
    data: { role: ['admin']}
  },
  {
    path: 'mission-nouveau/:idMission',
    title: 'Modifier un mission',
    component: NewMissionComponent,
    canActivate: [RoleAuthGuard],
    data: { role: ['admin']}
  },
  {
    path: 'list-missions',
    title: 'Recherche de missions',
    component: ListMissionComponent,
    canActivate: [RoleAuthGuard],
    data: { role: ['admin']}
  },
  {
    path: 'executer-missions',
    title: 'Exécuter vos missions',
    component: ExecuterMissionComponent,
    canActivate: [RoleAuthGuard],
    data: { role: ['admin', 'simple']}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routesMissions), CommonModule],
  exports: [RouterModule]
})
export class MissionsRoutingModule { }

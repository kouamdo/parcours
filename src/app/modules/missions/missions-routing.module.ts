import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExecuterMissionComponent } from './executer-mission/executer-mission.component';
import { ListMissionComponent } from './list-mission/list-mission.component';
import { NewMissionComponent } from './new-mission/new-mission.component';

const routes: Routes = [
  {
    path: 'mission-nouveau',
    title: 'Creer un nouvel mission',
    component: NewMissionComponent
  },
  {
    path: 'mission-nouveau/:idMission',
    title: 'Modifier un mission',
    component: NewMissionComponent
  },
  {
    path: 'list-missions',
    title: 'Recherche de missions',
    component: ListMissionComponent
  },
  {
    path: 'executer-missions',
    title: 'Exécuter vos missions',
    component: ExecuterMissionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MissionsRoutingModule { }

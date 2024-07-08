import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewEtapeComponent } from './new-etape/new-etape.component';
import { NewParoursComponent } from '../parours/new-parours/new-parours.component';
import { CommonModule } from '@angular/common';

const routesEtapes: Routes = [
  {
    path: 'etape-nouvelle',
    title: 'Enregistrer une nouvelle etape',
    component: NewEtapeComponent,
  },
  {
    path: 'parcours-nouveau',
    title: 'Enregistrer un nouveau parcours',
    component: NewParoursComponent,
  },
  {
    path: 'etape-nouvelle/:idEtape',
    title: 'Modifier une etape',
    component: NewEtapeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routesEtapes), CommonModule],
  exports: [RouterModule],
})
export class EtapeRoutingModule {}

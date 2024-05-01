import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewEtapeComponent } from './new-etape/new-etape.component';
import { ListEtapesComponent } from './list-etapes/list-etapes.component';
import { NewParoursComponent } from '../parours/new-parours/new-parours.component';

const routes = [
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
  {
    path: 'list-etapes',
    title: 'Recherche des etapes',
    component: ListEtapesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EtapeRoutingModule {}

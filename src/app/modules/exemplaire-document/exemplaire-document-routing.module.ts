import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListExemplaireComponent } from './list-exemplaire/list-exemplaire.component';
import { NewExemplaireComponent } from './new-exemplaire/new-exemplaire.component';
import { ViewExemplaireComponent } from './view-exemplaire/view-exemplaire.component';
import { PrevisualisationExemplaireComponent } from './previsualisation-exemplaire/previsualisation-exemplaire.component';
import { HistoriqueParPersonneComponent } from './historique-par-personne/historique-par-personne.component';
import { PageIntermediaireComponent } from './page-intermediaire/page-intermediaire.component';
import { CommonModule } from '@angular/common';

const routesExem: Routes = [
  {
    path: 'exemplaire-nouveau/:idDocument',
    title: 'Nouvel exemplaire de documents',
    component: NewExemplaireComponent
  },
  {
    path: 'exemplaire-nouveau/modify/:idExemplaire',
    title: 'Modifier formulaire de documents',
    component: NewExemplaireComponent
  },
  {
    path: 'view-exemplaire/:idExemplaire',
    title: 'Voir le document',
    component: ViewExemplaireComponent
  },
  {
    path: 'list-exemplaire',
    title: 'Voir les exemplaires',
    component: ListExemplaireComponent
  },
  {
    path: 'previsualisation-exemplaire/:idExemplaire',
    title: 'Voir le document',
    component: PrevisualisationExemplaireComponent
  },
  {
    path: 'historique-par-personne',
    title: 'Historique',
    component: HistoriqueParPersonneComponent
  },
  {
    path: 'page-intermedaire',
    title: 'Historique',
    component: PageIntermediaireComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routesExem), CommonModule],
  exports: [RouterModule]
})
export class ExemplaireDocumentRoutingModule { }

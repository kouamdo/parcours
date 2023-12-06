import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModalCategoriesComponent } from './modal-categories/modal-categories.component';

const routes: Routes = [
  
  {
    path: 'categorie-nouveau',
    title: 'Enregistrer une nouvelle categorie',
    component: ModalCategoriesComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { }

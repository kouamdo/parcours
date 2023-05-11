import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewFamilleComponent } from "./new-famille/new-famille.component";

const routes=[
  {
    path: 'famille-nouvelle',
    title: 'Enregistrer une nouvelle famille',
    component: NewFamilleComponent
  },
  {
    path: 'famille-nouvelle/:idfamille',
    title: 'Modifier une famille',
    component: NewFamilleComponent
  },


];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FamilleRoutingModule{}

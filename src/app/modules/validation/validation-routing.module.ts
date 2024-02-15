import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewValidationComponent } from './new-validation/new-validation.component'
import { ListValidationsComponent } from './list-validations/list-validations.component';
const routes: Routes = [
    {
        path: 'nouvelle-validation',
        title: 'Creer une nouvelle validation',
        component: NewValidationComponent
    },
    {
      path: 'list-validations',
      title: 'lister les différentes validations',
      component: ListValidationsComponent
    },
    {
      path: 'nouvelle-validation/:idValidation',
      title: 'Modifier une validation',
      component: NewValidationComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidationRoutingModule { }
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ElementInitComponent } from './element-init/element-init/element-init.component';

const routes: Routes = [

  {
    path: 'menu/element-init',
    title: '',
    component: ElementInitComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule { }

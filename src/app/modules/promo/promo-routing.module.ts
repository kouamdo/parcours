import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewPromoComponent } from './new-promo/new-promo.component';
import { ListPromoComponent } from './list-promo/list-promo.component';

const routes: Routes = [
  { path: 'promo-nouveau', 
    component: NewPromoComponent },
  {
    path: 'list-promo',
    title: 'Afficher la liste de promotion',
    component: ListPromoComponent,
  },
  {
    path: 'promo-nouveau/:idPromo',
    title: 'Modifier une Promotion',
    component: NewPromoComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromoRoutingModule {}

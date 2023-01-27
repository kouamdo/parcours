import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListTicketsComponent } from './list-tickets/list-tickets.component';
import { NewTicketComponent } from './new-ticket/new-ticket.component';
import { PanneauTicketComponent } from './panneau-ticket/panneau-ticket.component';

const routes: Routes = [
  {
    path: 'ticket-nouveau',
    title: 'Enregistrer un nouveau ticket',
    component: NewTicketComponent
  },
  {
    path: 'ticket-nouveau/:idticket',
    title: 'Modifier un ticket',
    component: NewTicketComponent
  },
  {
    path: 'list-tickets',
    title: 'Recherche de tickets',
    component: ListTicketsComponent
  },
  {
    path: 'panneau-tickets',
    component: PanneauTicketComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketsRoutingModule { }

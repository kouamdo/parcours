import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttributsRoutingModule } from './modules/attributs/attributs-routing.module';
import { DocumentsRoutingModule } from './modules/documents/documents-routing.module';
import { ExemplaireDocumentRoutingModule } from './modules/exemplaire-document/exemplaire-document-routing.module';
import { FamilleRoutingModule } from './modules/famille/famille-routing.module';
import { MissionsRoutingModule } from './modules/missions/missions-routing.module';
import { PatientsRoutingModule } from './modules/patients/patient-routing.module';
import { ServicesRoutingModule } from './modules/services/services-routing.module';
import { TicketsRoutingModule } from './modules/tickets/tickets-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { RessourceRoutingModule } from './modules/ressource/ressource-routing.module';
import { PrecoMvtRoutingModule } from './modules/precomvt/precomvt-routing.module';
import { DistributeurRoutingModule } from './modules/distributeur/distributeur-routing.module';
import { RoleRoutingModule } from './modules/role/role-routing.module';

const routes: Routes = [
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [
    PatientsRoutingModule,
    RouterModule.forRoot(routes),
    ServicesRoutingModule,
    TicketsRoutingModule,
    AttributsRoutingModule,
    MissionsRoutingModule,
    DocumentsRoutingModule,
    FamilleRoutingModule,
    RessourceRoutingModule,
    PrecoMvtRoutingModule,
    ExemplaireDocumentRoutingModule,
    FamilleRoutingModule,
    DistributeurRoutingModule,
    RoleRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

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
import { PersonnelsRoutingModule } from './modules/personnels/personnels-routing.module';
import { EtatsRoutingModule } from './modules/etats/etats-routing.module';
import { ValidationRoutingModule } from './modules/validation/validation-routing.module';
import { EtapeRoutingModule } from './modules/etape/etape-routing.module';
import { ParoursRoutingModule } from './modules/parours/parours-routing.module';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';



const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }, // Protège la route principale avec AuthGuard
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [
    PatientsRoutingModule,
    RouterModule.forRoot(routes),
    PersonnelsRoutingModule,
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
    RoleRoutingModule,
    EtatsRoutingModule,
    ValidationRoutingModule,
    EtapeRoutingModule,
    ParoursRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

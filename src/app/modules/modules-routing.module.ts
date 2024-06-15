import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttributsRoutingModule } from './attributs/attributs-routing.module';
import { DistributeurRoutingModule } from './distributeur/distributeur-routing.module';
import { DocumentsRoutingModule } from './documents/documents-routing.module';
import { EtapeRoutingModule } from './etape/etape-routing.module';
import { EtatsRoutingModule } from './etats/etats-routing.module';
import { ExemplaireDocumentRoutingModule } from './exemplaire-document/exemplaire-document-routing.module';
import { FamilleRoutingModule } from './famille/famille-routing.module';
import { MissionsRoutingModule } from './missions/missions-routing.module';
import { ParoursRoutingModule } from './parours/parours-routing.module';
import { PatientsRoutingModule } from './patients/patient-routing.module';
import { PersonnelsRoutingModule } from './personnels/personnels-routing.module';
import { PrecoMvtRoutingModule } from './precomvt/precomvt-routing.module';
import { RessourceRoutingModule } from './ressource/ressource-routing.module';
import { RoleRoutingModule } from './role/role-routing.module';
import { ServicesRoutingModule } from './services/services-routing.module';
import { TicketsRoutingModule } from './tickets/tickets-routing.module';
import { ValidationRoutingModule } from './validation/validation-routing.module';
import { ModulesComponent } from './modules.component';
import { AuthGuard } from '../auth/auth.guard';
import { NotFoundComponent } from '../not-found/not-found.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: 'parcours', component: ModulesComponent, canActivate: [AuthGuard],
    children: [
      {
        path: 'attributs',
        loadChildren: () => import('./attributs/attributs.module').then(m => m.AttributsModule) 
      },
      {
        path: 'patients',
        loadChildren: () => import('./patients/patients.module').then(m => m.PatientsModule) 
      },
      {
        path: 'personnels',
        loadChildren: () => import('./personnels/personnels.module').then(m => m.PersonnelsModule) 
      },
      {
        path: 'services',
        loadChildren: () => import('./services/services.module').then(m => m.ServicesModule) 
      },
      {
        path: 'validations',
        loadChildren: () => import('./validation/validation.module').then(m => m.ValidationModule) 
      },
      {
        path: 'tickets',
        loadChildren: () => import('./tickets/tickets.module').then(m => m.TicketsModule) 
      },
      {
        path: 'missions',
        loadChildren: () => import('./missions/missions.module').then(m => m.MissionsModule) 
      },
      {
        path: 'documents',
        loadChildren: () => import('./documents/documents.module').then(m => m.DocumentsModule) 
      },
      {
        path: 'familles',
        loadChildren: () => import('./famille/famille.module').then(m => m.FamilleModule) 
      },
      {
        path: 'roles',
        loadChildren: () => import('./role/role.module').then(m => m.RoleModule) 
      },
      {
        path: 'ressources',
        loadChildren: () => import('./ressource/ressource.module').then(m => m.RessourceModule) 
      },
      {
        path: 'preconisations',
        loadChildren: () => import('./precomvt/precomvt.module').then(m => m.PrecomvtModule) 
      },
      {
        path: 'distributeurs',
        loadChildren: () => import('./distributeur/distributeur.module').then(m => m.DistributeurModule) 
      },
      {
        path: 'etats',
        loadChildren: () => import('./etats/etats.module').then(m => m.EtatsModule) 
      },
      {
        path: 'parcour',
        loadChildren: () => import('./parours/parours.module').then(m => m.ParoursModule) 
      },
      {
        path: 'etapes',
        loadChildren: () => import('./etape/etape.module').then(m => m.EtapeModule) 
      },
      {
        path: '',
        redirectTo: '/parcours',
        pathMatch: 'full'
      },
      {
        path: '**',
        component: NotFoundComponent
      }
    ]
  }
];

@NgModule({
  imports: [
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
    ParoursRoutingModule,
    PatientsRoutingModule,
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }

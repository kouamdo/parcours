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
import { NotFoundComponent } from '../not-found/not-found.component';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../verify-users/auth/auth.guard';
import { RoleAuthGuard } from '../verify-users/role-users/role-auth.guard';

const routes: Routes = [
  { path: 'parcours', component: ModulesComponent, canActivate: [AuthGuard],
    children: [
      {
        path: 'attributs',
        loadChildren: () => import('./attributs/attributs.module').then(m => m.AttributsModule),
        canActivate: [RoleAuthGuard],
        data: { role: ['admin']} 
      },
      {
        path: 'patients',
        loadChildren: () => import('./patients/patients.module').then(m => m.PatientsModule),
        canActivate: [RoleAuthGuard],
        data: { role: ['admin']} 
      },
      {
        path: 'personnels',
        loadChildren: () => import('./personnels/personnels.module').then(m => m.PersonnelsModule),
        canActivate: [RoleAuthGuard],
        data: { role: ['admin', 'simple']} 
      },
      {
        path: 'services',
        loadChildren: () => import('./services/services.module').then(m => m.ServicesModule),
        canActivate: [RoleAuthGuard],
        data: { role: ['admin']} 
      },
      {
        path: 'validations',
        loadChildren: () => import('./validation/validation.module').then(m => m.ValidationModule),
        canActivate: [RoleAuthGuard],
        data: { role: ['admin']} 
      },
      {
        path: 'tickets',
        loadChildren: () => import('./tickets/tickets.module').then(m => m.TicketsModule),
        canActivate: [RoleAuthGuard],
        data: { role: ['admin']} 
      },
      {
        path: 'missions',
        loadChildren: () => import('./missions/missions.module').then(m => m.MissionsModule),
        canActivate: [RoleAuthGuard],
        data: { role: ['admin']} 
      },
      {
        path: 'documents',
        loadChildren: () => import('./documents/documents.module').then(m => m.DocumentsModule),
        canActivate: [RoleAuthGuard],
        data: { role: ['admin']} 
      },
      {
        path: 'familles',
        loadChildren: () => import('./famille/famille.module').then(m => m.FamilleModule),
        canActivate: [RoleAuthGuard],
        data: { role: ['admin']} 
      },
      {
        path: 'roles',
        loadChildren: () => import('./role/role.module').then(m => m.RoleModule),
        canActivate: [RoleAuthGuard],
        data: { role: ['admin']} 
      },
      {
        path: 'ressources',
        loadChildren: () => import('./ressource/ressource.module').then(m => m.RessourceModule),
        canActivate: [RoleAuthGuard],
        data: { role: ['admin']} 
      },
      {
        path: 'preconisations',
        loadChildren: () => import('./precomvt/precomvt.module').then(m => m.PrecomvtModule),
        canActivate: [RoleAuthGuard],
        data: { role: ['admin']} 
      },
      {
        path: 'distributeurs',
        loadChildren: () => import('./distributeur/distributeur.module').then(m => m.DistributeurModule),
        canActivate: [RoleAuthGuard],
        data: { role: ['admin']} 
      },
      {
        path: 'etats',
        loadChildren: () => import('./etats/etats.module').then(m => m.EtatsModule),
        canActivate: [RoleAuthGuard],
        data: { role: ['admin']} 
      },
      {
        path: 'parcours',
        loadChildren: () => import('./parours/parours.module').then(m => m.ParoursModule),
        canActivate: [RoleAuthGuard],
        data: { role: ['admin']} 
      },
      {
        path: 'etapes',
        loadChildren: () => import('./etape/etape.module').then(m => m.EtapeModule),
        canActivate: [RoleAuthGuard],
        data: { role: ['admin']} 
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

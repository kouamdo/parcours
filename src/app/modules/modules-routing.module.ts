import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttributsRoutingModule } from './attributs/attributs-routing.module';
import { DistributeurRoutingModule } from './components/distributeur/distributeur-routing.module';
import { DocumentsRoutingModule } from './components/documents/documents-routing.module';
import { EtapeRoutingModule } from './components/etape/etape-routing.module';
import { EtatsRoutingModule } from './components/etats/etats-routing.module';
import { ExemplaireDocumentRoutingModule } from './components/exemplaire-document/exemplaire-document-routing.module';
import { FamilleRoutingModule } from './components/famille/famille-routing.module';
import { MissionsRoutingModule } from './components/missions/missions-routing.module';
import { ParoursRoutingModule } from './components/parours/parours-routing.module';
import { PatientsRoutingModule } from './components/patients/patient-routing.module';
import { PersonnelsRoutingModule } from './components/personnels/personnels-routing.module';
import { PrecoMvtRoutingModule } from './components/precomvt/precomvt-routing.module';
import { RessourceRoutingModule } from './components/ressource/ressource-routing.module';
import { RoleRoutingModule } from './components/role/role-routing.module';
import { ServicesRoutingModule } from './components/services/services-routing.module';
import { TicketsRoutingModule } from './components/tickets/tickets-routing.module';
import { ValidationRoutingModule } from './components/validation/validation-routing.module';
import { ModulesComponent } from './modules.component';
import { DetailPatientsComponent } from './components/patients/detail-patients/detail-patients.component';
import { ListPatientsComponent } from './components/patients/list-patients/list-patients.component';
import { NewPatientComponent } from './components/patients/new-patient/new-patient.component';
//import { ListAttributsComponent } from './components/attributs/list-attributs/list-attributs.component';
//import { NewAttributComponent } from './components/attributs/new-attribut/new-attribut.component';
import { ListDistributeursComponent } from './components/distributeur/list-distributeurs/list-distributeurs.component';
import { NewDistributeurComponent } from './components/distributeur/new-distributeur/new-distributeur.component';
import { ListFormDocumentComponent } from './components/documents/list-form-document/list-form-document.component';
import { NewFormDocumentComponent } from './components/documents/new-form-document/new-form-document.component';
import { ViewFormDocumentComponent } from './components/documents/view-form-document/view-form-document.component';
import { ListEtapesComponent } from './components/etape/list-etapes/list-etapes.component';
import { NewEtapeComponent } from './components/etape/new-etape/new-etape.component';
import { NewParoursComponent } from './components/parours/new-parours/new-parours.component';
import { ListEtatsComponent } from './components/etats/list-etats/list-etats.component';
import { NewEtatComponent } from './components/etats/new-etat/new-etat.component';
import { HistoriqueParPersonneComponent } from './components/exemplaire-document/historique-par-personne/historique-par-personne.component';
import { ListExemplaireComponent } from './components/exemplaire-document/list-exemplaire/list-exemplaire.component';
import { NewExemplaireComponent } from './components/exemplaire-document/new-exemplaire/new-exemplaire.component';
import { PageIntermediaireComponent } from './components/exemplaire-document/page-intermediaire/page-intermediaire.component';
import { PrevisualisationExemplaireComponent } from './components/exemplaire-document/previsualisation-exemplaire/previsualisation-exemplaire.component';
import { ViewExemplaireComponent } from './components/exemplaire-document/view-exemplaire/view-exemplaire.component';
import { ListFamillesComponent } from './components/famille/list-familles/list-familles.component';
import { NewFamilleComponent } from './components/famille/new-famille/new-famille.component';
import { ExecuterMissionComponent } from './components/missions/executer-mission/executer-mission.component';
import { ListMissionComponent } from './components/missions/list-mission/list-mission.component';
import { NewMissionComponent } from './components/missions/new-mission/new-mission.component';
import { ListParoursComponent } from './components/parours/list-parours/list-parours.component';
import { DetailPersonnelsComponent } from './components/personnels/detail-personnels/detail-personnels.component';
import { ListPersonnelsComponent } from './components/personnels/list-personnels/list-personnels.component';
import { NewPersonnelComponent } from './components/personnels/new-personnel/new-personnel.component';
import { RolesPersonnelComponent } from './components/personnels/roles-personnel/roles-personnel.component';
import { ListPrecomvtsComponent } from './components/precomvt/list-precomvts/list-precomvts.component';
import { NewPrecomvtComponent } from './components/precomvt/new-precomvt/new-precomvt.component';
import { ViewPrecomvtComponent } from './components/precomvt/view-precomvt/view-precomvt.component';
import { ListRessourcesComponent } from './components/ressource/list-ressources/list-ressources.component';
import { NewRessourceComponent } from './components/ressource/new-ressource/new-ressource.component';
import { ListRolesComponent } from './components/role/list-roles/list-roles.component';
import { MissionsRoleComponent } from './components/role/missions-role/missions-role.component';
import { NewRoleComponent } from './components/role/new-role/new-role.component';
import { ListServicesComponent } from './components/services/list-services/list-services.component';
import { NewServicesComponent } from './components/services/new-services/new-services.component';
import { ListTicketsComponent } from './components/tickets/list-tickets/list-tickets.component';
import { NewTicketComponent } from './components/tickets/new-ticket/new-ticket.component';
import { PanneauTicketComponent } from './components/tickets/panneau-ticket/panneau-ticket.component';
import { ListValidationsComponent } from './components/validation/list-validations/list-validations.component';
import { NewValidationComponent } from './components/validation/new-validation/new-validation.component';
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
     /* {
        path: 'patient-nouveau',
        title: 'Enregistrer un nouveau patient',
        component: NewPatientComponent,
      },
      {
        path: 'detail-patients/:idPatient',
        title: 'Details du patient',
        component: DetailPatientsComponent,
      },
      {
        path: 'patient-nouveau/:idPatient',
        title: 'Modifier un patient',
        component: NewPatientComponent,
      },
      {
        path: 'list-patients',
        title: 'Recherche de patients',
        component: ListPatientsComponent,
      },
      {
        path: 'attribut-nouveau',
        title: 'Creer un nouvel attribut',
        component: NewAttributComponent
      },
      {
        path: 'attribut-nouveau/:idAttribut',
        title: 'Modifier un attribut',
        component: NewAttributComponent
      },
      {
        path: 'list-attributs',
        title: 'Recherche de attributs',
        component: ListAttributsComponent
      },
      {
        path: 'distributeur-nouveau',
        title: 'Enregistrer un nouveau distributeur',
        component: NewDistributeurComponent
      },
      {
        path: 'distributeur-nouveau/:idDistributeur',
        title: 'Modifier un distributeur',
        component: NewDistributeurComponent
      },
      {
        path: 'list-distributeurs',
        title: 'Recherche de distributeurs',
        component: ListDistributeursComponent
      },
      {
        path: 'document-nouveau',
        title: 'Nouveau formulaire de documents',
        component: NewFormDocumentComponent
      },
      {
        path: 'document-nouveau/:idDocument',
        title: 'Nouveau formulaire de documents',
        component: NewFormDocumentComponent
      },
      {
        path: 'list-documents',
        title: 'liste formulaires de documents',
        component: ListFormDocumentComponent
      },
      {
        path: 'view-document/:idDocument',
        title: 'Voir le document',
        component: ViewFormDocumentComponent
      },
      {
        path: 'etape-nouvelle',
        title: 'Enregistrer une nouvelle etape',
        component: NewEtapeComponent,
      },
      {
        path: 'parcours-nouveau',
        title: 'Enregistrer un nouveau parcours',
        component: NewParoursComponent,
      },
      {
        path: 'etape-nouvelle/:idEtape',
        title: 'Modifier une etape',
        component: NewEtapeComponent,
      },
      {
        path: 'list-etapes',
        title: 'Recherche des etapes',
        component: ListEtapesComponent,
      },
      {
        path: 'etat-nouveau',
        title: 'Creer un nouvel etat',
        component: NewEtatComponent
      },
      {
        path: 'etat-nouveau/:idEtat',
        title: 'Modifier un etat',
        component: NewEtatComponent
      },
      {
        path: 'list-etats',
        title: 'Recherche des etats',
        component: ListEtatsComponent
      },
      {
        path: 'exemplaire-nouveau/:idDocument',
        title: 'Nouvel exemplaire de documents',
        component: NewExemplaireComponent
      },
      {
        path: 'exemplaire-nouveau/modify/:idExemplaire',
        title: 'Modifier formulaire de documents',
        component: NewExemplaireComponent
      },
      {
        path: 'view-exemplaire/:idExemplaire',
        title: 'Voir le document',
        component: ViewExemplaireComponent
      },
      {
        path: 'list-exemplaire',
        title: 'Voir les exemplaires',
        component: ListExemplaireComponent
      },
      {
        path: 'previsualisation-exemplaire/:idExemplaire',
        title: 'Voir le document',
        component: PrevisualisationExemplaireComponent
      },
      {
        path: 'historique-par-personne',
        title: 'Historique',
        component: HistoriqueParPersonneComponent
      },
      {
        path: 'page-intermedaire',
        title: 'Historique',
        component: PageIntermediaireComponent
      },
      {
        path: 'famille-nouvelle',
        title: 'Enregistrer une nouvelle famille',
        component: NewFamilleComponent
      },
      {
        path: 'famille-nouvelle/:idFamille',
        title: 'Modifier une famille',
        component: NewFamilleComponent
      },
      {
        path: 'list-familles',
        title: 'Recherche de familles',
        component: ListFamillesComponent
      },
      {
        path: 'mission-nouveau',
        title: 'Creer un nouvel mission',
        component: NewMissionComponent
      },
      {
        path: 'mission-nouveau/:idMission',
        title: 'Modifier un mission',
        component: NewMissionComponent
      },
      {
        path: 'list-missions',
        title: 'Recherche de missions',
        component: ListMissionComponent
      },
      {
        path: 'executer-missions',
        title: 'Exécuter vos missions',
        component: ExecuterMissionComponent
      },
      {
        path: 'nouveau-parours',
        title: 'Enregistrer un nouveau parcours',
        component: NewParoursComponent,
      },
      {
        path: 'nouveau-parours/:idParours',
        title: 'Modifier un parcours',
        component: NewParoursComponent,
      },
      {
        path: 'list-parours',
        title: 'Recherche de parcours',
        component: ListParoursComponent,
      },
      {
        path: 'nouvelle-etape',
        title: 'creer une etape',
        component: NewEtapeComponent,
      },
      {
        path: 'nouveau-personnel',
        title: 'Enregistrer un nouveau personnel',
        component: NewPersonnelComponent,
      },
      {
        path: 'update-personnel/:idPersonnel',
        title: 'Modifier un personnel',
        component: NewPersonnelComponent,
      },
      {
        path: 'list-personnels',
        title: 'Afficher le personnel de la clinique',
        component: ListPersonnelsComponent,
      },
      {
        path: 'affecte-role-personnel/:idPersonnel',
        title: 'Affecter un ou plusieurs roles a un personnel',
        component: RolesPersonnelComponent,
      },
      {
        path: 'detail-personnels/:idPersonnel',
        title: 'Details du personnel ',
        component: DetailPersonnelsComponent,
      },
      {
        path: 'precomvt-nouvelle',
        title: 'Enregistrer une nouvelle precomvt',
        component: NewPrecomvtComponent
      },
      {
        path: 'precomvt-nouvelle/:idPrecoMvt',
        title: 'Modifier une préconisation',
        component: NewPrecomvtComponent
      },
      {
        path: 'list-precomvts',
        title: 'Recherche de precomvts',
        component: ListPrecomvtsComponent
      },
      {
        path: 'view-precomvt/:idPrecoMvt',
        title: 'Voir la precomvt',
        component: ViewPrecomvtComponent
      },
      {
        path: 'ressource-nouvelle',
        title: 'Enregistrer une nouvelle ressource',
        component: NewRessourceComponent
      },
      {
        path: 'ressource-nouvelle/:idRessource',
        title: 'Modifier une ressource',
        component: NewRessourceComponent
      },
      {
        path: 'list-ressources',
        title: 'Recherche de ressources',
        component: ListRessourcesComponent
      },
      {
        path: 'role-nouveau',
        title: 'Enregistrer un nouveau role',
        component: NewRoleComponent
      },
      {
        path: 'role-nouveau/:idRole',
        title: 'Modifier un role',
        component: NewRoleComponent
      },
      {
        path: 'list-roles',
        title: 'Recherche de roles',
        component: ListRolesComponent
      },
      {
        path: 'affecte-mission-role/:idRole',
        title: 'Affecter un ou plusieurs missions a un role',
        component: MissionsRoleComponent
      },
      {
        path: 'service-nouveau',
        title: 'Enregistrer un nouveau service',
        component: NewServicesComponent
      },
      {
        path: 'service-nouveau/:idService',
        title: 'Modifier un service',
        component: NewServicesComponent
      },
      {
        path: 'list-services',
        title: 'Recherche de services',
        component: ListServicesComponent
      },
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
      },
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
      },*/
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
    AttributsRoutingModule,
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModulesRoutingModule } from './modules-routing.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../app.module';
import { AttributsModule } from './components/attributs/attributs.module';
import { DistributeurModule } from './components/distributeur/distributeur.module';
import { DocumentsModule } from './components/documents/documents.module';
import { EtapeModule } from './components/etape/etape.module';
import { EtatsModule } from './components/etats/etats.module';
import { ExemplaireDocumentModule } from './components/exemplaire-document/exemplaire-document.module';
import { FamilleModule } from './components/famille/famille.module';
import { MissionsModule } from './components/missions/missions.module';
import { ParoursModule } from './components/parours/parours.module';
import { PatientsModule } from './components/patients/patients.module';
import { PersonnelsModule } from './components/personnels/personnels.module';
import { PrecomvtModule } from './components/precomvt/precomvt.module';
import { RessourceModule } from './components/ressource/ressource.module';
import { RoleModule } from './components/role/role.module';
import { ServicesModule } from './components/services/services.module';
import { SharedModule } from './components/shared/shared.module';
import { TicketsModule } from './components/tickets/tickets.module';
import { ValidationModule } from './components/validation/validation.module';
import { MenuComponent } from './menu/menu.component';
import { ModulesComponent } from './modules.component';


@NgModule({
  declarations: [ModulesComponent, MenuComponent],
  imports: [
    CommonModule,
    ModulesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule,
    PatientsModule,
    PersonnelsModule,
    ServicesModule,
    TicketsModule,
    AttributsModule,
    MissionsModule,
    DocumentsModule,
    FamilleModule,
    RessourceModule,
    PrecomvtModule,
    CommonModule,
    DistributeurModule,
    RoleModule,
    ValidationModule,
    EtapeModule,
    ParoursModule,
    // ngx-translate and the loader module
    HttpClientModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      extend: true,
    }),
    MatSliderModule,
    MatIconModule,
    MatToolbarModule,
    MatSlideToggleModule,
    ExemplaireDocumentModule,
    SharedModule,
    EtatsModule
  ]
})
export class ModulesModule { }

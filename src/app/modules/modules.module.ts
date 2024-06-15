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
import { AttributsModule } from './attributs/attributs.module';
import { DistributeurModule } from './distributeur/distributeur.module';
import { DocumentsModule } from './documents/documents.module';
import { EtapeModule } from './etape/etape.module';
import { EtatsModule } from './etats/etats.module';
import { ExemplaireDocumentModule } from './exemplaire-document/exemplaire-document.module';
import { FamilleModule } from './famille/famille.module';
import { MissionsModule } from './missions/missions.module';
import { ParoursModule } from './parours/parours.module';
import { PatientsModule } from './patients/patients.module';
import { PersonnelsModule } from './personnels/personnels.module';
import { PrecomvtModule } from './precomvt/precomvt.module';
import { RessourceModule } from './ressource/ressource.module';
import { RoleModule } from './role/role.module';
import { ServicesModule } from './services/services.module';
import { SharedModule } from './shared/shared.module';
import { TicketsModule } from './tickets/tickets.module';
import { ValidationModule } from './validation/validation.module';
import { ModulesComponent } from './modules.component';
import { MenuComponent } from './menu/menu.component';


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

import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PatientsModule } from './modules/patients/patients.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { InMemDBService } from './backend/backend';
import { NotFoundComponent } from './not-found/not-found.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule,} from '@angular/material/slide-toggle';
import { ServicesModule } from './modules/services/services.module';
import { MenuComponent } from './menu/menu.component';
import { TicketsModule } from './modules/tickets/tickets.module';
import { AttributsModule } from './modules/attributs/attributs.module';
import { MissionsModule } from './modules/missions/missions.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { ExemplaireDocumentModule } from './modules/exemplaire-document/exemplaire-document.module';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FamilleModule } from './modules/famille/famille.module';
import { RessourceModule } from './modules/ressource/ressource.module';
import { PrecomvtModule } from './modules/precomvt/precomvt.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { DistributeurModule } from './modules/distributeur/distributeur.module';
import { RoleModule } from './modules/role/role.module';
import { PersonnelsModule } from './modules/personnels/personnels.module';
import { SharedModule } from './modules/shared/shared.module';


import { EtatsModule } from './modules/etats/etats.module';
import { ValidationModule } from './modules/validation/validation.module';
import { EtapeModule } from './modules/etape/etape.module';
import { ParoursModule } from './modules/parours/parours.module';
import { PromoModule } from './modules/promo/promo.module';
import { CaissesModule } from './modules/caisses/caisses.module';
import { ComptesModule } from './modules/comptes/comptes.module';

@NgModule({
  declarations: [AppComponent, NotFoundComponent, MenuComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemDBService, {
      dataEncapsulation: false,
      passThruUnknownUrl: true,
    }),
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
    PromoModule,
    CommonModule,
    DistributeurModule,
    RoleModule,
    ValidationModule,
    CaissesModule,
    ComptesModule,

    EtapeModule,
    ParoursModule,
    // ngx-translate and the loader module
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      extend: true,
    }),
    BrowserAnimationsModule,
    MatSliderModule,
    MatIconModule,
    MatToolbarModule,
    MatSlideToggleModule,
    ExemplaireDocumentModule,
    SharedModule,
    EtatsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
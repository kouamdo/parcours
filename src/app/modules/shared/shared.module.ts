import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { HttpLoaderFactory } from 'src/app/app.module';
import { ModalCategoriesComponent } from './modal-categories/modal-categories.component';
import {
  MatDialogModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
} from '@angular/material/dialog';
import { ModalChoixAttributsComponent } from './modal-choix-attributs/modal-choix-attributs.component';
import { ModalChoixPreconisationsComponent } from './modal-choix-preconisations/modal-choix-preconisations.component';
//import { MatCheckboxModule } from '@angular/material/checkbox';
import { EnteteComponent } from './entete/entete.component';
import { ModalChoixSousDocumentComponent } from './modal-choix-sous-document/modal-choix-sous-document.component';
import { ModalChoixSousExemplairesComponent } from './modal-choix-sous-exemplaires/modal-choix-sous-exemplaires.component';
import { ModalChoixDocumentsComponent } from './modal-choix-documents/modal-choix-documents.component';
import { ModalDocEtatsComponent } from './modal-document-doc-etats/modal-document-doc-etats.component';
import { ModalRessourceAttributsComponent } from './modal-ressource-attributs/modal-ressource-attributs.component';
import { ModalRoleValidationComponent } from './modal-role-validation/modal-role-validation.component';
import { ModalCodebarreComponent } from './modal-codebarre/modal-codebarre.component';
import { ModalCodebarreDialogComponent } from './modal-codebarre-dialog/modal-codebarre-dialog.component';
import { ModalCodebarreScanContinueComponent } from './modal-codebarre-scan-continue/modal-codebarre-scan-continue.component';
import { MatIconModule } from '@angular/material/icon';
import { ModalChoixDocEtatComponent } from './modal-choix-doc-etat/modal-choix-doc-etat.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { ModalChoixPersonneComponent } from './modal-choix-personne/modal-choix-personne.component';
import { MatSelectModule } from '@angular/material/select';
import { ModalChoixPromotionRessourceComponent } from './modal-choix-promotion-ressource/modal-choix-promotion-ressource.component';
import { ModalAffecterComptePersonnelComponent } from './modal-affecter-compte-personnel/modal-affecter-compte-personnel.component';
import { ModalMouvementCaisseCompteComponent } from './modal-mouvement-caisse-compte/modal-mouvement-caisse-compte.component';
import { ModalMouvementCaisseComponent } from './modal-mouvement-caisse/modal-mouvement-caisse.component';
import { ModalBilleterieComponent } from './modal-billeterie/modal-billeterie.component';

@NgModule({
  declarations: [
    ModalCategoriesComponent,
    ModalChoixAttributsComponent,
    ModalChoixPreconisationsComponent,
    EnteteComponent,
    ModalChoixSousDocumentComponent,
    ModalChoixSousExemplairesComponent,
    ModalDocEtatsComponent,
    ModalRessourceAttributsComponent,
    ModalRoleValidationComponent,
    ModalCodebarreComponent,
    ModalCodebarreDialogComponent,
    ModalCodebarreScanContinueComponent,
    ModalChoixDocumentsComponent,
    ModalChoixDocEtatComponent,
    ModalChoixPersonneComponent,
    ModalChoixPromotionRessourceComponent,
    ModalAffecterComptePersonnelComponent,
    ModalMouvementCaisseCompteComponent,
    ModalMouvementCaisseComponent,
    ModalBilleterieComponent,
  ],
  exports: [
    ModalCategoriesComponent,
    EnteteComponent,
    ModalChoixSousDocumentComponent,
    ModalChoixSousExemplairesComponent,
    ModalDocEtatsComponent,
    ModalChoixAttributsComponent,
    ModalCodebarreComponent,
    ModalCodebarreDialogComponent,
    ModalCodebarreScanContinueComponent,
    ModalRoleValidationComponent,
    ModalRessourceAttributsComponent,
    ModalChoixDocumentsComponent,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatRadioModule,
    //MatFormFieldModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatIconModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      extend: true,
    })
  ],
  providers: [
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
  ],
})
export class SharedModule {}

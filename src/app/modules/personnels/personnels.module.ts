import { QRCodeModule } from 'angularx-qrcode';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NewPersonnelComponent } from './new-personnel/new-personnel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';
import { TicketsModule } from '../tickets/tickets.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { ListPersonnelsComponent } from './list-personnels/list-personnels.component';
import { RolesPersonnelComponent } from './roles-personnel/roles-personnel.component';
import { SharedModule } from '../shared/shared.module';
import { DetailPersonnelsComponent } from './detail-personnels/detail-personnels.component';
import { ModulesRoutingModule } from '../modules-routing.module';
import { DetailUserComponent } from './detail-user/detail-user.component';

@NgModule({
  declarations: [
    NewPersonnelComponent,
    ListPersonnelsComponent,
    RolesPersonnelComponent,
    DetailPersonnelsComponent,
    DetailUserComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ModulesRoutingModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    TicketsModule,
    QRCodeModule,
    MatRadioModule,
    SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      extend: true,
    })
  ],
  providers: [DatePipe],
})
export class PersonnelsModule {}

import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { MatSelectModule } from '@angular/material/select';

import { NewValidationComponent } from './new-validation/new-validation.component';
import { ListValidationsComponent } from './list-validations/list-validations.component';
import { ModulesRoutingModule } from '../../modules-routing.module';



@NgModule({
  declarations: [
    NewValidationComponent,
    ListValidationsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    ModulesRoutingModule,
    MatTableModule,
    MatSortModule,
    MatSelectModule,
    TranslateModule.forChild({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        },
        extend:true
    })
  ],
  providers: [DatePipe],
})
export class ValidationModule { }

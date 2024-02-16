import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListPatientsComponent } from './list-patients/list-patients.component';
import { NewPatientComponent } from './new-patient/new-patient.component';
import { DetailPatientsComponent } from './detail-patients/detail-patients.component';

const routes = [
  {
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
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientsRoutingModule {}

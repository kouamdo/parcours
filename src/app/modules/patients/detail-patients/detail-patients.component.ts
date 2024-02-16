import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientsService } from 'src/app/services/patients/patients.service';
import { IPatient, IPersonneRattachee } from 'src/app/modele/Patient';

@Component({
  selector: 'app-detail-patients',
  templateUrl: './detail-patients.component.html',
  styleUrls: ['./detail-patients.component.css'],
})
export class DetailPatientsComponent implements OnInit {
  patientId!: string;
  patient: any;
  attachedPatients: IPatient[] = [];

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.patientId = params['idPatient'];
      this.getDetailPatients();
    });
  }
  getDetailPatients() {
    this.patientService.getPatientById(this.patientId).subscribe((data) => {
      this.patient = data;

      if (this.patient) {
        this.patientService.getAllPatients().subscribe((patients) => {
          this.attachedPatients = patients.filter(
            (patient) =>
              patient.personnesRatachees &&
              patient.personnesRatachees.some(
                (person) => person.id === this.patient.id
              )
          );
        });
      }
    });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPatient } from 'src/app/modele/Patient';
import { forkJoin, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { log } from 'console';

@Injectable({
  providedIn: 'root',
})
export class PatientsService {
  selectedpersonnesRatacheess: IPatient[] = [];
  constructor(private http: HttpClient) {}

  // Récupérer tous les patients
  getAllPatients(): Observable<IPatient[]> {
    return this.http.get<IPatient[]>('api/patients').pipe(map((x) => x));
  }

  // Récupérer un patient par son ID
  getPatientById(id: string): Observable<IPatient> {
    return this.getAllPatients().pipe(
      map((x) => {
        return x.find((p) => p.id == id) as IPatient;
      })
    );
  }

  // Récupérer des patients par leur nom
  getPatientsByName(nom: string): Observable<IPatient[]> {
    return this.http.get<IPatient[]>('api/patients').pipe(
      map((x) => {
        return x.filter((p) => p.nom.toLowerCase().startsWith(nom));
      })
    );
  }

  // Récupérer des patients par leur nom ou leur ID
  getPatientsByNameOrId(query: string): Observable<IPatient[]> {
    return this.http.get<IPatient[]>('api/patients').pipe(
      map((patients) => {
        const lowerCaseQuery = query.toLowerCase();

        // Filtrer par ID ou nom
        return patients.filter(
          (p) =>
            p.id.toString().startsWith(query) ||
            p.nom.toLowerCase().startsWith(lowerCaseQuery)
        );
      })
    );
  }

  getPatientsByQrcode(query: string): Observable<IPatient[]> {
    return this.http.get<IPatient[]>('api/patients').pipe(
      switchMap((patients) => {
        const lowerCaseQuery = query.toLowerCase();
        const matchingPatients = patients.filter((p) =>
          p.qrCodeValue.toLowerCase().startsWith(lowerCaseQuery)
        );

        console.log("Matching patients by QR code:", matchingPatients);

        // Get all patients who have matchingPatients in their personnesRatachees
        const attachedPatients$ = matchingPatients.map((patient) =>
          this.getPatientsWithPersonnesRatachees(patient.id)
        );

        return forkJoin([of(matchingPatients), ...attachedPatients$]).pipe(
          map((results) => {
            const allPatients = results.flat();
            // Remove duplicates
            const uniquePatients = allPatients.filter(
              (patient, index, self) =>
                index === self.findIndex((p) => p.id === patient.id)
            );

            console.log("All patients including related patients:", allPatients);
            console.log("Unique patients:", uniquePatients);

            return uniquePatients;
          })
        );
      })
    );
  }

  // Helper method to get all patients who have a specific patient ID in their personnesRatachees
  private getPatientsWithPersonnesRatachees(personId: string): Observable<IPatient[]> {
    return this.getAllPatients().pipe(
      map((patients) => {
        const relatedPatients = patients.filter((patient) =>
          patient.personnesRatachees?.some((p) => p.id === personId)
        );
        console.log(`Patients with personnesRatachees ID ${personId}:`, relatedPatients);
        return relatedPatients;
      })
    );
  }


// Ajouter un patient
ajouterPatient(patient: IPatient) {
  return this.http.post('api/patients', patient);
}

getPatientpersonnesRatacheess(id: string): Observable<IPatient[]> {
  return this.getPatientById(id).pipe(
    switchMap((patient) => {
      if (patient.personnesRatachees && patient.personnesRatachees.length > 0) {
        const personnesRatacheessRequests = patient.personnesRatachees.map((person) =>
          this.getPatientById(person.id)
        );
        return forkJoin(personnesRatacheessRequests);
      } else {
        return of([]);
      }
    })
  );
}

addSelectedpersonnesRatachees(personnesRatachees: IPatient) {
  // Check if the personnesRatachees is already in the array
  const index = this.selectedpersonnesRatacheess.findIndex((a) => a.id === personnesRatachees.id);
  if (index === -1) {
    this.selectedpersonnesRatacheess.push(personnesRatachees); // Add personnesRatachees if not already present
  }
}

// Method to remove selected personnesRatachees
removeSelectedpersonnesRatachees(personnesRatachees: IPatient) {
  this.selectedpersonnesRatacheess = this.selectedpersonnesRatacheess.filter((a) => a.id !== personnesRatachees.id);
}
}

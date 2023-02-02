import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  map } from 'rxjs/operators';
import { IPatient } from 'src/app/modele/Patient';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {

  constructor(private http:HttpClient) { }

  getAllPatients():Observable<IPatient[]>
  {
    return this.http.get<IPatient[]>('api/patients').pipe(map(x=>x));
  }

  getPatientById(id:string):Observable<IPatient>{
    return this.getAllPatients().pipe(
      map(x=>
        {
          return x.find(p=>p.id==id) as IPatient
        })
    );
  }

   getPatientsByName(nom:string): Observable<IPatient[]> {
    return this.http.get<IPatient[]>('api/patients').pipe(
      map(x=>
        {
          return x.filter(p=> p.nom.toLowerCase().startsWith(nom))
        })
    );        
  }

  ajouterPatient(patient:IPatient)
  {
    return this.http.post("api/patients",patient);
  }
}

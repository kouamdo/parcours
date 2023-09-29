import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  map } from 'rxjs/operators';
import { IPersonnel } from 'src/app/modele/personnel';

@Injectable({
  providedIn: 'root'
})
export class PersonnelsService {

  constructor(private http:HttpClient) { }

  getAllPersonnels():Observable<IPersonnel[]>
  {
    return this.http.get<IPersonnel[]>('api/personnels').pipe(map(x=>x));
  }

  getPersonnelById(id:string):Observable<IPersonnel>{
    return this.getAllPersonnels().pipe(
      map(x=>
        {
          return x.find(p=>p.id==id) as IPersonnel
        })
    );
  }

   getPersonnelsByName(nom:string): Observable<IPersonnel[]> {
    return this.http.get<IPersonnel[]>('api/personnels').pipe(
      map(x=>
        {
          return x.filter(p=> p.nom.toLowerCase().startsWith(nom))
        })
    );        
  }

  ajouterPersonnel(personnel:IPersonnel)
  {
    return this.http.post("api/personnels",personnel);
  }
}

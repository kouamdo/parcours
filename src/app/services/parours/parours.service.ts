import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  map } from 'rxjs/operators';
import { IParours } from 'src/app/modele/parours';

@Injectable({
  providedIn: 'root'
})
export class ParoursService {

  constructor(private http:HttpClient) { }


  getAllParours():Observable<IParours[]>
  {
    return this.http.get<IParours[]>('api/parours').pipe(map(x=>x));
  }

  getParoursById(id:string):Observable<IParours>{
    return this.getAllParours().pipe(
      map(x=>
        {
          return x.find(p=>p.id==id) as IParours
        })
    );
  }

   getParoursBylibelle(libelle:string): Observable<IParours[]> {
    return this.http.get<IParours[]>('api/parours').pipe(
      map(x=>
        {
          return x.filter(p=> p.libelle.toLowerCase().startsWith(libelle))
        })
    );
  }

  ajouterParours(parours:IParours)
  {
    return this.http.post("api/parours",parours);
  }
}

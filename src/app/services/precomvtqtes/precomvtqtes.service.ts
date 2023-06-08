import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {  map } from 'rxjs/operators';
import { IPrecomvtqte } from 'src/app/modele/precomvtqte';


@Injectable({
  providedIn: 'root'
})
export class PrecomvtqtesService {
  constructor(private http:HttpClient) { }

  getAllPrecomvtqtes():Observable<IPrecomvtqte[]>
  {
    return this.http.get<IPrecomvtqte[]>('api/precomvtqte').pipe(map(x=>x));
  }

  getPrecomvtqteById(id:string):Observable<IPrecomvtqte>{
    return this.getAllPrecomvtqtes().pipe(
      map(x=>
        {
          return x.find(p=>p.id==id) as IPrecomvtqte
        })
    );
  }

   getPrecomvtqtesByLibelle(libelle:string): Observable<IPrecomvtqte[]> {
    return this.http.get<IPrecomvtqte[]>('api/precomvtqte').pipe(
      map(x=>
        {
          return x.filter(p=> p.libelle.toLowerCase().startsWith(libelle))
        })
    );
  }

  ajouterPrecomvtqte(precomvtqte:IPrecomvtqte)
  {
    return this.http.post("api/precomvtqte",precomvtqte);
  }
}

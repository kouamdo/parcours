import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {  map } from 'rxjs/operators';
import { IPrecomvt } from 'src/app/modele/precomvt';

@Injectable({
  providedIn: 'root'
})
export class PrecomvtsService {
  constructor(private http:HttpClient) { }

  getAllPrecomvts():Observable<IPrecomvt[]>
  {
    return this.http.get<IPrecomvt[]>('api/precomvt').pipe(map(x=>x));
  }

  getPrecomvtById(id:string):Observable<IPrecomvt>{
    return this.getAllPrecomvts().pipe(
      map(x=>
        {
          return x.find(p=>p.id==id) as IPrecomvt
        })
    );
  }

   getPrecomvtsByLibelle(libelle:string): Observable<IPrecomvt[]> {
    return this.http.get<IPrecomvt[]>('api/precomvt').pipe(
      map(x=>
        {
          return x.filter(p=> p.libelle.toLowerCase().startsWith(libelle))
        })
    );
  }

  ajouterPrecomvt(precomvt:IPrecomvt)
  {
    return this.http.post("api/precomvt",precomvt);
  }
}

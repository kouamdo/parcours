import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  map } from 'rxjs/operators';
import { IFamille } from 'src/app/modele/famille';

@Injectable({
  providedIn: 'root'
})
export class FamillesService {

  constructor(private http:HttpClient) { }

  getAllFamilles():Observable<IFamille[]>
  {
    return this.http.get<IFamille[]>('api/familles').pipe(map(x=>x));
  }

  getFamilleById(id:string):Observable<IFamille>{
    return this.getAllFamilles().pipe(
      map(x=>
        {
          return x.find(p=>p.id==id) as IFamille
        })
    );
  }

   getFamillesByName(libelle:string): Observable<IFamille[]> {
    return this.http.get<IFamille[]>('api/familles').pipe(
      map(x=>
        {
          return x.filter(p=> p.libelle.toLowerCase().startsWith(libelle))
        })
    );
  }

  ajouterFamille(famille:IFamille)
  {
    return this.http.post("api/familles",famille);
  }
}

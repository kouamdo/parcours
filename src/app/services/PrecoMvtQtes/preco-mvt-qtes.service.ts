import { Injectable } from '@angular/core';
import { IPrecoMvtQte } from 'src/app/modele/preco-mvt-qte';
import { Observable } from 'rxjs';
import {  map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class PrecoMvtQtesService {

  constructor(private http:HttpClient) { }

  getAllPrecoMvtQtes():Observable<IPrecoMvtQte[]>
  {
    return this.http.get<IPrecoMvtQte[]>('api/precomvtqte').pipe(map(x=>x));
  }

  getPrecoMvtQteById(id:string):Observable<IPrecoMvtQte>{
    return this.getAllPrecoMvtQtes().pipe(
      map(x=>
        {
          return x.find(p=>p.id==id) as IPrecoMvtQte
        })
    );
  }

   getPrecoMvtQtesByName(quantiteMin:string): Observable<IPrecoMvtQte[]> {
    return this.http.get<IPrecoMvtQte[]>('api/precomvtqte').pipe(
      map(x=>
        {
          return x.filter(p=> p.quantiteMin.toString().toLowerCase().startsWith(quantiteMin))
        })
    );
  }

  ajouterPrecoMvtQte(precomvtqte:IPrecoMvtQte)
  {
    return this.http.post("api/precomvtqte",precomvtqte);
  }
}

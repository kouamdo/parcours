import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  map } from 'rxjs/operators';
import { IAttributs } from 'src/app/modele/attributs';
import { TypeAttribut } from 'src/app/modele/type-attributs';

@Injectable({
  providedIn: 'root'
})
export class AttributService {

  constructor(private http:HttpClient) { }
  getAllAttributs():Observable<IAttributs[]>
  {
    return this.http.get<IAttributs[]>('api/attributs').pipe(map(x=>x));
  }

  getAttributById(id:string):Observable<IAttributs>{
    return this.getAllAttributs().pipe(
      map(x=>
        {
          return x.find(p=>p.id==id) as IAttributs
        })
    );
  }

  getAttributsByTitre(titre:string): Observable<IAttributs[]> {
   return this.http.get<IAttributs[]>('api/attributs').pipe(
     map(x=>
       {
         return x.filter(p=> p.titre.toLowerCase().startsWith(titre))
       })
   );
  }

  ajouterAttribut(attribut:IAttributs)
  {
    return this.http.post("api/attributs",attribut);
  }

  getTypeAttribut():Observable<TypeAttribut>
  {
    return this.http.get<TypeAttribut>('api/typeAttribut').pipe(map(x=>x));
  }

}

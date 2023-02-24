import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IAttributs } from 'src/app/modele/attributs';

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
         return x.filter(a=> a.titre.toLowerCase().startsWith(titre))
       })
   );        
 }

  ajouterAttribut(attribut:IAttributs)
  {
    return this.http.post("api/attributs",attribut);
  }
}

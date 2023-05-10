import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ICategorie } from 'src/app/modele/categorie';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  constructor(private http:HttpClient) { }

  getAllCategorie():Observable<ICategorie[]>
  {
    return this.http.get<ICategorie[]>('api/categorie');
  }

  getCategorieById(id:string):Observable<ICategorie>{
    return this.getAllCategorie().pipe(
      map(x=>
        {
          return x.find(d=>d.id==id) as ICategorie 
        })
    );
  }
  
  getCategorieByNom(nom:string): Observable<ICategorie[]> {
    return this.http.get<ICategorie[]>('api/categorie').pipe(
      map(x=>
        {
          return x.filter(d=> d.nom.toLowerCase().startsWith(nom))
        })
    );        
  }
 
   ajouterCategorie(categorie:ICategorie )
   {
     return this.http.post("api/categorie",categorie);
   }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ICategoriesAttributs } from 'src/app/modele/categories-attributs';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  constructor(private http:HttpClient) { }

  getAllCategorie():Observable<ICategoriesAttributs[]>
  {
    return this.http.get<ICategoriesAttributs[]>('api/categorie');
  }

  getCategorieById(id:string):Observable<ICategoriesAttributs>{
    return this.getAllCategorie().pipe(
      map(x=>
        {
          return x.find(d=>d.id==id) as ICategoriesAttributs 
        })
    );
  }
  
  getCategorieByNom(nom:string): Observable<ICategoriesAttributs[]> {
    return this.http.get<ICategoriesAttributs[]>('api/categorie').pipe(
      map(x=>
        {
          return x.filter(d=> d.nom.toLowerCase().startsWith(nom))
        })
    );        
  }
 
   ajouterCategorie(categorie:ICategoriesAttributs )
   {
     return this.http.post("api/categorie",categorie);
   }
}

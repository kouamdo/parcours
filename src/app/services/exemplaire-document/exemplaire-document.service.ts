import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IExemplaireDocument } from 'src/app/modele/exemplaire-document';

@Injectable({
  providedIn: 'root'
})
export class ExemplaireDocumentService {

  constructor(private http:HttpClient) { }

  getAllExemplaireDocuments():Observable<IExemplaireDocument[]>
  {
    return this.http.get<IExemplaireDocument[]>('api/exemplaires');
  }

  getExemplaireDocumentById(id:string):Observable<IExemplaireDocument>{
    return this.getAllExemplaireDocuments().pipe(
      map(x=>
        {
          return x.find(d=>d.id==id) as IExemplaireDocument 
        })
    );
  }
   ajouterExemplaireDocument(exemplaire:IExemplaireDocument )
   {
     return this.http.post("api/exemplaires",exemplaire);
   }
}

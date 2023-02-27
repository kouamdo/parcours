import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IDocument } from 'src/app/modele/document';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private http:HttpClient) { }

  getAllDocuments():Observable<IDocument[]>
  {
    return this.http.get<IDocument[]>('api/documents').pipe(map(x=>x));
  }

  getDocumentById(id:string):Observable<IDocument >{
    return this.getAllDocuments().pipe(
      map(x=>
        {
          return x.find(d=>d.id==id) as IDocument 
        })
    );
  }
  
  getDocumentByLibelle(titre:string): Observable<IDocument[]> {
    return this.http.get<IDocument[]>('api/documents').pipe(
      map(x=>
        {
          return x.filter(d=> d.titre.toLowerCase().startsWith(titre))
        })
    );        
  }
 
   ajouterDocument(service:IDocument )
   {
     return this.http.post("api/documents",service);
   }
}

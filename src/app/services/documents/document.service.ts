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
    return this.http.get<IDocument[]>('api/documents');
  }

  getDocumentById(id:string):Observable<IDocument>{
    return this.getAllDocuments().pipe(
      map(x=>
        {
          return x.find(d=>d.id==id) as IDocument 
        })
    );
  }
  
  getDocumentByTitre(titre:string): Observable<IDocument[]> {
    return this.http.get<IDocument[]>('api/documents').pipe(
      map(x=>
        {
          return x.filter(d=> d.titre.toLowerCase().startsWith(titre))
        })
    );        
  }
 
   ajouterDocument(document:IDocument )
   {
     return this.http.post("api/documents",document);
   }

   getDocumentByMission(idMission:string): Observable<IDocument[]> {
    return this.http
      .get<IDocument[]>('api/documents')
      .pipe(
        map((x) => x.filter((d) => d.missions.some((m) => m.id === idMission)))
      );    
  }
}

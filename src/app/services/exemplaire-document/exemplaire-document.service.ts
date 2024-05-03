import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IDocEtats } from 'src/app/modele/doc-etats';
import { IExemplaireDocument } from 'src/app/modele/exemplaire-document';
import { IOrdreEtat } from 'src/app/modele/ordreEtat';
import { DocumentService } from '../documents/document.service';
import { IDocument } from 'src/app/modele/document';

@Injectable({
  providedIn: 'root',
})
export class ExemplaireDocumentService {
  res!: boolean;
  i!: number;
  ordreEtat!: IOrdreEtat;
  constructor(
    private http: HttpClient,
    private documentService: DocumentService
  ) {}

  getAllExemplaireDocuments(): Observable<IExemplaireDocument[]> {
    return this.http.get<IExemplaireDocument[]>('api/exemplaires');
  }

  getExemplaireDocumentById(id: string): Observable<IExemplaireDocument> {
    return this.getAllExemplaireDocuments().pipe(
      map((x) => {
        return x.find((d) => d.id == id) as IExemplaireDocument;
      })
    );
  }

  getExemplaireDocumentByOrder(exemplaire: IExemplaireDocument, doc: IDocument) {

    this.ordreEtat = exemplaire.ordreEtats![exemplaire.ordreEtats!.length - 1];
    
      console.log("doc :", doc, " exemplaire :", exemplaire);
      
      for (let index = 0; index < doc.docEtats.length; index++) {
        if (doc.docEtats[index].etat.id == this.ordreEtat.etat.id) {
          this.i = index;
        }
      }
      if (doc.docEtats[this.i].validation != undefined) {
        this.res = true;
      } else {
        this.res = false;
      }
      return { ele: this.ordreEtat, sol: this.res, in: this.i };
  }
  
  getExemplaireDocumentByIdPersonneRatachee(idPersonne:string): Observable<IExemplaireDocument[]> {
    return this.http.get<IExemplaireDocument[]>('api/exemplaires').pipe(
      map(x=>
        {
          return x.filter(e=> e.personneRattachee.id.toLowerCase() == idPersonne)
        })
    );        
  }

  getExemplaireDocumentByTitre(
    titre: string
  ): Observable<IExemplaireDocument[]> {
    return this.http.get<IExemplaireDocument[]>('api/exemplaires').pipe(
      map((x) => {
        return x.filter((e) => e.titre.toLowerCase().startsWith(titre));
      })
    );
  }

  ajouterExemplaireDocument(exemplaire: IExemplaireDocument) {
    return this.http.post('api/exemplaires', exemplaire);
  }
}

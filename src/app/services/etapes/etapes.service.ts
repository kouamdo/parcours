import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { IEtape } from 'src/app/modele/etape';
import { IDocument } from 'src/app/modele/document';
import { IDocEtats } from 'src/app/modele/doc-etats';

@Injectable({
  providedIn: 'root',
})
export class EtapesService {
  constructor(private http: HttpClient) {}

  getAllEtapes(): Observable<IEtape[]> {
    return this.http.get<IEtape[]>('api/etape').pipe(map((x) => x));
  }

  getEtapeById(id: string): Observable<IEtape> {
    return this.getAllEtapes().pipe(
      map((x) => {
        return x.find((p) => p.id === id) as IEtape;
      })
    );
  }

  getEtapesBylibelle(libelle: string): Observable<IEtape[]> {
    return this.http.get<IEtape[]>('api/etape').pipe(
      map((x) => {
        return x.filter((p) => p.libelle.toLowerCase().startsWith(libelle));
      })
    );
  }

  ajouterEtape(etape: IEtape): Observable<any> {
    console.log('etape', etape);
    return this.http.post('api/etape', etape);
  }

  updateDocEtatsWithCheckedEtapes(etape: IEtape) {
    etape.document.forEach((document) => {
      document.DocEtats.forEach((docEtat) => {
        if (docEtat.checked) {
          docEtat.etape = etape;
          console.log('etape new', docEtat);
        }
      });
    });
  }

  getDocumentsByEtapeId(etapeId: string): Observable<IDocument[]> {
    // Perform a search in the iEtat table to find etapes associated with the given etape ID
    // Then return the documents associated with those etapes
    return this.http.get<IDocEtats[]>('api/iEtat').pipe(
      map((docEtats) => {
        const associatedDocuments: IDocument[] = [];
        docEtats.forEach((docEtat) => {
          if (docEtat.etape!.id === etapeId && docEtat.etape?.document) {
            associatedDocuments.push(...docEtat.etape.document);
          }
        });
        return associatedDocuments;
      })
    );
  }
}

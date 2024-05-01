import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IDocument } from 'src/app/modele/document';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private selectedEtats: { [documentId: string]: string } = {};

  constructor(private http: HttpClient) {}

  getAllDocuments(): Observable<IDocument[]> {
    return this.http.get<IDocument[]>('api/documents');
  }

  getDocumentById(id: string): Observable<IDocument> {
    return this.getAllDocuments().pipe(
      map((x) => {
        return x.find((d) => d.id == id) as IDocument;
      })
    );
  }

  getDocumentByTitre(titre: string): Observable<IDocument[]> {
    return this.http.get<IDocument[]>('api/documents').pipe(
      map((x) => {
        return x.filter((d) => d.titre.toLowerCase().startsWith(titre));
      })
    );
  }

  ajouterDocument(document: IDocument) {
    return this.http.post('api/documents', document);
  }

  getDocumentByMission(idMission: string): Observable<IDocument[]> {
    return this.http.get<IDocument[]>('api/documents').pipe(
      map((x) => {
        return x.filter((d) => {
          let b: boolean = false;
          d.missions.forEach((m) => {
            if (m.id == idMission) b = true;
          });
          if (b) return d;
          else return;
        });
      })
    );
  }
  setSelectedEtat(documentId: string, etat: string) {
    this.selectedEtats[documentId] = etat;
    console.log('ete', etat);
  }

  getSelectedEtat(documentId: string): string {
    return this.selectedEtats[documentId] || '';
  }
}

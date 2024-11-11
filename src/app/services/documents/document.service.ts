// document.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IDocument } from 'src/app/modele/document';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private selectedEtats: { [documentId: string]: string } = {};
  private selectedDocuments: Set<string> = new Set();

  constructor(private http: HttpClient) {}

  getAllDocuments(): Observable<IDocument[]> {
    return this.http.get<IDocument[]>('api/documents');
  }

  getDocumentById(id: string): Observable<IDocument> {
    return this.getAllDocuments().pipe(
      map((x) => x.find((d) => d.idDocument === id) as IDocument)
    );
  }

  getDocumentByTitre(titre: string): Observable<IDocument[]> {
    return this.http
      .get<IDocument[]>('api/documents')
      .pipe(
        map((x) => x.filter((d) => d.titre.toLowerCase().startsWith(titre)))
      );
  }

  ajouterDocument(document: IDocument) {
    return this.http.post('api/documents', document);
  }

  getDocumentByMission(idMission: string): Observable<IDocument[]> {
    return this.http
      .get<IDocument[]>('api/documents')
      .pipe(
        map((x) => x.filter((d) => d.missions.some((m) => m.id === idMission)))
      );
  }

  setSelectedEtat(documentId: string, etat: string) {
    this.selectedEtats[documentId] = etat;
  }

  getSelectedEtat(documentId: string): string {
    return this.selectedEtats[documentId] || '';
  }

  selectDocument(documentId: string) {
    this.selectedDocuments.add(documentId);
  }

  unselectDocument(documentId: string) {
    this.selectedDocuments.delete(documentId);
  }

  isSelected(documentId: string): boolean {
    return this.selectedDocuments.has(documentId);
  }
}

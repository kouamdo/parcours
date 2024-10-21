import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IRessource } from 'src/app/modele/ressource';

@Injectable({
  providedIn: 'root',
})
export class RessourcesService {
  constructor(private http: HttpClient) {}

  getAllRessources(): Observable<IRessource[]> {
    return this.http.get<IRessource[]>('api/ressource').pipe(map((x) => x));
  }

  getRessourceById(id: string): Observable<IRessource> {
    return this.getAllRessources().pipe(
      map((x) => {
        return x.find((p) => p.id == id) as IRessource;
      })
    );
  }

  getRessourcesByLibelle(libelle: string): Observable<IRessource[]> {
    return this.http.get<IRessource[]>('api/ressource').pipe(
      map((x) => {
        return x.filter((p) => p.libelle.toLowerCase().startsWith(libelle));
      })
    );
  }

  getRessourcesByScanBarCodeorLibelle(query: string): Observable<IRessource[]> {
    return this.http.get<IRessource[]>('api/ressource').pipe(
      map((resources) => {
        const lowerCaseQuery = query.toLowerCase();

        // Filter by ID or name
        return resources.filter(
          (p) =>
            p.libelle.toLowerCase().startsWith(query) ||
            p.scanBarCode.toLowerCase().startsWith(lowerCaseQuery)
        );
      })
    );
  }

  ajouterRessource(ressource: IRessource) {
    return this.http.post('api/ressource', ressource);
  }
}

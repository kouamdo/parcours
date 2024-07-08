import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPrecoMvt } from 'src/app/modele/precomvt';

@Injectable({
  providedIn: 'root',
})
export class PrecoMvtsService {
  constructor(private http: HttpClient) {}

  getAllPrecomvts(): Observable<IPrecoMvt[]> {
    return this.http.get<IPrecoMvt[]>('api/precomvt').pipe(map((x) => x));
  }

  getPrecomvtById(id: string): Observable<IPrecoMvt> {
    return this.getAllPrecomvts().pipe(
      map((x) => {
        return x.find((p) => p.id == id) as IPrecoMvt;
      })
    );
  }

  getPrecomvtsByLibelle(libelle: string): Observable<IPrecoMvt[]> {
    return this.http.get<IPrecoMvt[]>('api/precomvt').pipe(
      map((x) => {
        return x.filter((p) => p.libelle.toLowerCase().startsWith(libelle));
      })
    );
  }

  ajouterPrecomvt(precomvt: IPrecoMvt) {
    return this.http.post('api/precomvt', precomvt);
  }
}

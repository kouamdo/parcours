import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IGroupes } from 'src/app/modele/groupes';

@Injectable({
  providedIn: 'root'
})
export class GroupesService {

  constructor(private http: HttpClient) {}

  getAllGroups(): Observable<IGroupes[]> {
    return this.http.get<IGroupes[]>('api/groupes').pipe(map((x) => x));
  }

  getGroupeById(id: string): Observable<IGroupes> {
    return this.getAllGroups().pipe(
      map((x) => {
        return x.find((p) => p.id == id) as IGroupes;
      })
    );
  }

  ajouterGroupe(groupe: IGroupes) {
    return this.http.post('api/groupes', groupe);
  }
}

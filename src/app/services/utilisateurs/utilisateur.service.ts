import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUtilisateurs } from 'src/app/modele/utilisateurs';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  constructor(private http: HttpClient) {}

  getAllUtilisateurs(): Observable<IUtilisateurs[]> {
    return this.http.get<IUtilisateurs[]>('api/utilisateurs').pipe(map((x) => x));
  }

  getUtilisateurById(id: string): Observable<IUtilisateurs> {
    return this.getAllUtilisateurs().pipe(
      map((x) => {
        return x.find((p) => p.id == id) as IUtilisateurs;
      })
    );
  }

  getUtilisateurByMail(mail: string): Observable<IUtilisateurs> {
    return this.getAllUtilisateurs().pipe(
      map((x) => {
        return x.find((p) => p.login == mail) as IUtilisateurs;
      })
    );
  }

  getUtilisateurByMailMdp(mail: string, mdp: string): Observable<IUtilisateurs> {
    return this.getAllUtilisateurs().pipe(
      map((x) => {
        return x.find((p) => p.login == mail && p.passWord == mdp) as IUtilisateurs;
      })
    );
  }

  getUtilisateursById(id: string): Observable<IUtilisateurs[]> {
    return this.http.get<IUtilisateurs[]>('api/utilisateurs').pipe(
      map((x) => {
        return x.filter((p) => p.id.toLowerCase().startsWith(id));
      })
    );
  }

}

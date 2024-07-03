import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IUtilisateurs } from 'src/app/modele/utilisateurs';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

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

  getUsersByName(nom: string): Observable<IUtilisateurs[]> {
    return this.http.get<IUtilisateurs[]>('api/utilisateurs').pipe(
      map((x) => {
        return x.filter((p) => p.user.nom.toLowerCase().startsWith(nom));
      })
    );
  }

  getUsersByNameOrId(query: string): Observable<IUtilisateurs[]> {
    return this.http.get<IUtilisateurs[]>('api/utilisateurs').pipe(
      map((patients) => {
        const lowerCaseQuery = query.toLowerCase();

        // Filter by ID or name
        return patients.filter(
          (p) =>
            p.user.id.toString().startsWith(query) ||
            p.user.nom.toLowerCase().startsWith(lowerCaseQuery)
        );
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

  getUserById(id: string): Observable<IUtilisateurs> {
    return this.getAllUtilisateurs().pipe(
      map((x) => {
        return x.find((p) => p.user.id.toLowerCase().startsWith(id)) as IUtilisateurs;
      })
    );
  }

  ajouterUser(personne: IUtilisateurs) {
    return this.http.post('api/utilisateurs', personne);
  }

  updateUser(user: IUtilisateurs) {
    return this.http.put('api/utilisateurs', user, this.httpOptions).pipe(
      catchError(this.handleError<any>('updateUser'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      return of(result as T);
    };
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilisateurService } from '../utilisateurs/utilisateur.service';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  
  constructor(private http: HttpClient, private utilisateur: UtilisateurService, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')!));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  private authenticated: any;

  login(username: string, password: string) {
    // Implémentez la logique de connexion ici
    // Si l'authentification est réussie, définissez authenticated à true
    return this.utilisateur.getUtilisateurByMailMdp(username, password).pipe(map(user => {
      // stocker les détails de l'utilisateur et le jeton jwt dans le stockage local pour garder l'utilisateur connecté entre les rafraîchissements de la page
      const { passWord, ...userSamme } = user;
      localStorage.setItem('currentUser', JSON.stringify(userSamme));
        this.currentUserSubject.next(userSamme);
        this.authenticated = user; // Exemple simplifié
      return user;
    }))
  }

  requestPasswordReset(email: string) {
    return this.utilisateur.getUtilisateurByMail(email).pipe(map(user => {
      return user;
    }))
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(`/reset-password`, { token, password });
  }

  logout() {
    // supprimer l'utilisateur du stockage local pour déconnecter l'utilisateur
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}

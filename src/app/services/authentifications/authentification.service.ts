import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PersonnelsService } from '../personnels/personnels.service';
import { PatientsService } from '../patients/patients.service';
import { IPersonnel } from 'src/app/modele/personnel';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  
  constructor(private http: HttpClient, private personnel: PersonnelsService, private patient: PatientsService, private router: Router) {
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
    return this.personnel.getPersonnelByMailMdp(username, password).pipe(map(user => {
      // stocker les détails de l'utilisateur et le jeton jwt dans le stockage local pour garder l'utilisateur connecté entre les rafraîchissements de la page
      localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.authenticated = user; // Exemple simplifié
      return user;
    }))
  }

  logout() {
    // supprimer l'utilisateur du stockage local pour déconnecter l'utilisateur
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}

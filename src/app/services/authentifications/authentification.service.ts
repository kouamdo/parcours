import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  constructor() { }

  private authenticated: boolean = false;

  login(req:FormBuilder): boolean {
    // Implémentez la logique de connexion ici
    // Si l'authentification est réussie, définissez authenticated à true
    this.authenticated = true; // Exemple simplifié
    return this.authenticated;
  }

  logout(): void {
    this.authenticated = false;
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }
}

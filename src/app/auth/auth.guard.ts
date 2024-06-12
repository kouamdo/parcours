// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthentificationService } from '../services/authentifications/authentification.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthentificationService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      // l'utilisateur est connecté, donc retournez true
      return true;
    }

    // non connecté, donc redirigez vers la page de connexion avec l'URL de retour
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}

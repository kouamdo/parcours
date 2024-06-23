import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthentificationService } from 'src/app/services/authentifications/authentification.service';

@Injectable({
  providedIn: 'root'
})
export class RoleAuthGuard implements CanActivate {
  constructor(private authService: AuthentificationService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userRole = this.authService.currentUserValue.groupe.libelle;
    const expectedRole = route.data['role'].find((r: any) => r == userRole);

    console.log("ele du user :", userRole, expectedRole);
    
    if (userRole === expectedRole) {
      return true;
    } else {
      this.router.navigate(['/parcours']);
      return false;
    }
  }
  
}

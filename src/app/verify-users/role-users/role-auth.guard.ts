import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { IElements } from 'src/app/modele/elements';
import { IMenu } from 'src/app/modele/menu';
import { AuthentificationService } from 'src/app/services/authentifications/authentification.service';
import { MenusService } from 'src/app/services/menus/menus.service';

@Injectable({
  providedIn: 'root'
})
export class RoleAuthGuard implements CanActivate {
  constructor(private authService: AuthentificationService, private router: Router, private menuService:MenusService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let lienUse!: IElements;
    let menu : IMenu = this.authService.currentUserValue.groupe.menu.find((m: IMenu) => m.langue == localStorage.getItem('langue')!)
    menu.fonctionnalites.find((m) => lienUse = m.elements.find((l) => l.lien == './'+route.routeConfig?.path+'/'+route.children[0]!.routeConfig?.path || l.lien == route.routeConfig?.path+'/'+route.children[0].routeConfig?.path)!)
    console.log("ele du user :", lienUse, route.routeConfig?.path+'/'+route.children[0].routeConfig?.path, route);
    
    if (lienUse || 'personnels/detail-user' == route.routeConfig?.path+'/'+route.children[0].routeConfig?.path || 'documents/historique-par-personne' == route.routeConfig?.path+'/'+route.children[0].routeConfig?.path || 'missions/executer-missions' == route.routeConfig?.path+'/'+route.children[0].routeConfig?.path || 'missions/exemplaire-nouveau' == route.routeConfig?.path+'/'+route.children[0].routeConfig?.path) {
      return true;
    } else {
      this.router.navigate(['/parcours']);
      return false;
    }
  }
  
}

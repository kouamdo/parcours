import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IMenu } from 'src/app/modele/menu';
import { IUtilisateurs } from 'src/app/modele/utilisateurs';


@Injectable({
  providedIn: 'root'
})
export class MenusService {

  constructor(private http:HttpClient) { }

  getMenus():Observable<IMenu[]>
  {
    return this.http.get<IMenu[]>('api/menu').pipe(map(x=>x));
  }

  getMenu():Observable<IUtilisateurs[]>
  {
    return this.http.get<IUtilisateurs[]>('api/utilisateurs').pipe(map(x=>x));
  }

  getMenuByUserAndLangue(login:string, langue:string):Observable<IMenu>{
    let user : any;
    return this.getMenu().pipe(
      map(x=>
        {
          user = x.find(p => p.user?.email == login);
          if (user.menu != null) {
            return user.menu.find((p: { langue: string; }) => p.langue == langue) as unknown as IMenu;
          } else {
            return user.groupe.menu.find((p: { langue: string; }) => p.langue == langue) as unknown as IMenu;
          }
        })
    );
  }

  ajouterMenu(menu:IMenu)
  {
    return this.http.post("api/menu",menu);
  }

}

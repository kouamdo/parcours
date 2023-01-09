import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IMenus } from 'src/app/modele/menus';


@Injectable({
  providedIn: 'root'
})
export class MenusService {

  constructor(private http:HttpClient) { }

  getMenu():Observable<IMenus[]>
  {
    return this.http.get<IMenus[]>('api/menus').pipe(map(x=>x));
  }

  getMenuByUserAndLangue(login:string, langue:string):Observable<IMenus>{
    return this.getMenu().pipe(
      map(x=>
        {
          return x.find(p=>p.idUser==login && p.langue==langue) as IMenus
        })
    );
  }

  ajouterMenu(menu:IMenus)
  {
    return this.http.post("api/menus",menu);
  }

}

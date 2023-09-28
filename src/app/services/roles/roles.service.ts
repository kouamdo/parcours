import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { IRole } from 'src/app/modele/role';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http:HttpClient) { }


  getAllRoles():Observable<IRole[]>
  {
    return this.http.get<IRole[]>('api/role').pipe(map(x=>x));
  }

  getRoleById(id:string):Observable<IRole>{
    return this.getAllRoles().pipe(
      map(x=>
        {
          return x.find(p=>p.id==id) as IRole
        })
    );
  }

   getRolesBytitre(titre:string): Observable<IRole[]> {
    return this.http.get<IRole[]>('api/role').pipe(
      map(x=>
        {
          return x.filter(p=> p.titre.toLowerCase().startsWith(titre))
        })
    );
  }

  ajouterRole(role:IRole)
  {
    return this.http.post("api/role",role);
  }
}

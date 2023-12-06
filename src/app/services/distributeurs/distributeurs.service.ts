import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { IDistributeur } from 'src/app/modele/distributeur';

@Injectable({
  providedIn: 'root'
})
export class DistributeursService {

  constructor(private http:HttpClient) { }


  getAllDistributeurs():Observable<IDistributeur[]>
  {
    return this.http.get<IDistributeur[]>('api/distributeur').pipe(map(x=>x));
  }

  getDistributeurById(id:string):Observable<IDistributeur>{
    return this.getAllDistributeurs().pipe(
      map(x=>
        {
          return x.find(p=>p.id==id) as IDistributeur
        })
    );
  }

   getDistributeursByraisonSocial(raisonSocial:string): Observable<IDistributeur[]> {
    return this.http.get<IDistributeur[]>('api/distributeur').pipe(
      map(x=>
        {
          return x.filter(p=> p.raisonSocial.toLowerCase().startsWith(raisonSocial))
        })
    );
  }

  ajouterDistributeur(distributeur:IDistributeur)
  {
    return this.http.post("api/distributeur",distributeur);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IMouvementCaisses } from 'src/app/modele/mouvement-caisses';

@Injectable({
  providedIn: 'root'
})
export class MouvementCaisseService {

  constructor(private http: HttpClient) { }

  getAllMvtCaisse():Observable<IMouvementCaisses[]>
  {
    return this.http.get<IMouvementCaisses[]>('api/mvtCaisses').pipe(map(x=>x));
  }

  getMvtCaisseById(id:string):Observable<IMouvementCaisses>{
    return this.getAllMvtCaisse().pipe(
      map(x=>
        {
          return x.find(p=>p.id==id) as IMouvementCaisses
        })
    );
  }

  getMvtCaisseByUser(idUser:string):Observable<IMouvementCaisses>{
    return this.getAllMvtCaisse().pipe(
      map(x=>
        {
          return x.find(p=>p.personnel?.id==idUser) as IMouvementCaisses
        })
    );
  }

  ajouterMouvement(mvt:IMouvementCaisses)
  {
    return this.http.post("api/mvtCaisses",mvt);
  }
}
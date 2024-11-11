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

  getExemplaireDocumentByIdMvtCaisse(idDoc:string): Observable<IMouvementCaisses[]> {
    return this.http.get<IMouvementCaisses[]>('api/mvtCaisses').pipe(
      map(x=>
        {
          return x.filter(e=> e.exemplaire.id.toLowerCase() == idDoc)
        })
    );        
  }

  ajouterMouvement(mvt:IMouvementCaisses | IMouvementCaisses[])
  {
    let value : IMouvementCaisses;

    if (Array.isArray(mvt)) {
      value = mvt[mvt.length - 1];
      mvt.forEach((item) => {
        this.http.post("api/mvtCaisses",item);
      });
    } else {
      value = mvt;
      console.error('mvt is not an array:', mvt);
    }
    
    return this.http.post("api/mvtCaisses",value);
  }
}

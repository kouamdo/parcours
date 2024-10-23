import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IComptes } from 'src/app/modele/comptes';

@Injectable({
  providedIn: 'root'
})
export class ComptesService {

  constructor(private http: HttpClient) { }

  getAllComptes():Observable<IComptes[]>
  {
    return this.http.get<IComptes[]>('api/comptes').pipe(map(x=>x));
  }

  getCompteById(id:string):Observable<IComptes>{
    return this.getAllComptes().pipe(
      map(x=>
        {
          return x.find(p=>p.id==id) as IComptes
        })
    );
  }

  getCompteByUser(idUser:string):Observable<IComptes>{
    return this.getAllComptes().pipe(
      map(x=>
        {
          return x.find(p=>p.beneficiaire?.id==idUser) as IComptes
        })
    );
  }

  getComptesByLibelle(libelle:string): Observable<IComptes[]> {
    return this.http.get<IComptes[]>('api/comptes').pipe(
      map(x=>
        {
          return x.filter(p=> p.libelle.toLowerCase().startsWith(libelle))
        })
    );
   }

  ajouterCompte(compte:IComptes)
  {
    return this.http.post("api/comptes",compte);
  }
}

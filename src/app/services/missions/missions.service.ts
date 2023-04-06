import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IMission } from 'src/app/modele/mission';

@Injectable({
  providedIn: 'root'
})
export class MissionsService {

  constructor(private http:HttpClient) { }

  getAllMissions():Observable<IMission []>
  {
    return this.http.get<IMission []>('api/missions').pipe(map(x=>x));
  }

  getMissionById(id:string):Observable<IMission >{
    return this.getAllMissions().pipe(
      map(x=>
        {
          return x.find(m=>m.id==id) as IMission 
        })
    );
  }
  
  getMissionByLibelle(libelle:string): Observable<IMission[]> {
    return this.http.get<IMission[]>('api/missions').pipe(
      map(x=>
        {
          return x.filter(m=> m.libelle.toLowerCase().startsWith(libelle))
        })
    );        
  }
 
   ajouterMission(mission:IMission )
   {
     return this.http.post("api/missions",mission);
   }

   getMissionByUser(idUser:string):Observable<IMission[]>{
    return this.getAllMissions().pipe(
      map(x=>
        {//m.idLogin?.toLowerCase()==idUser.toLocaleLowerCase()
          return x.filter(m=>  true)
        })
    );
  }
}

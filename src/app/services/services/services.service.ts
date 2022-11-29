import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IService } from 'src/app/modele/service';
@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(private http:HttpClient) { }

  getAllServices():Observable<IService []>
  {
    return this.http.get<IService []>('api/services').pipe(map(x=>x));
  }

  getServiceById(id:number):Observable<IService >{
    return this.getAllServices().pipe(
      map(x=>
        {
          return x.find(p=>p.id==id) as IService 
        })
    );
  }

  ajouterService(service:IService )
  {
    return this.http.post("api/services",service);
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { IValidation } from 'src/app/modele/validation';

@Injectable({
  providedIn: 'root'
})
export class ValidationsService {

  constructor(private http:HttpClient) { }

  getAllValidations():Observable<IValidation []>
  {
    return this.http.get<IValidation []>('api/validations').pipe(map(x=>x));
  }

  getValidationById(id:string):Observable<IValidation >{
    return this.getAllValidations().pipe(
      map(x=>
        {
          return x.find(m=>m.id==id) as IValidation 
        })
    );
  }
  
  getValidationByCode(code:string): Observable<IValidation[]> {
    return this.http.get<IValidation[]>('api/validations').pipe(
      map(x=>
        {
          return x.filter(m=> m.code.toLowerCase().startsWith(code))
        })
    );        
  }
  
  getValidationByLibelle(libelle:string): Observable<IValidation[]> {
    return this.http.get<IValidation[]>('api/validations').pipe(
      map(x=>
        {
          return x.filter(m=> m.libelle.toLowerCase().startsWith(libelle))
        })
    );        
  }
 
   ajouterValidation(validation:IValidation )
   {
     return this.http.post("api/validations",validation);
   }
}
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TypeMvt } from 'src/app/modele/type-mvt';

@Injectable({
  providedIn: 'root'
})
export class DonneesEchangeService {
  dataDocumentCategorie : any;
  dataDocumentPrecoMvts : any;
  dataDocumentAttributs : any;
  dataDocumentCodebarre : any;
  dataDocumentSousDocuments : any;
  dataEnteteMenu : any;
  dataDocumentSousExemplaireDocuments : any;
  dataDocumentEtats : any;
  dataRoleValidation : any;
  constructor(private http:HttpClient) { }

  getTypeMvt():Observable<TypeMvt>
  {
    return this.http.get<TypeMvt>('api/typeMvt');
  }

}

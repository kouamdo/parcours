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
  dataEtapeDocuments:any;
  dataDocumentDocuments:any;
  dataExemplairePersonneRatachee : any;
  dataUrlExemplaireDePersonne : any;
  constructor(private http:HttpClient) { }

  getTypeMvt():Observable<TypeMvt>
  {
    return this.http.get<TypeMvt>('api/typeMvt');
  }

  /**
   * Méthode permettant d'affecter une valeur au libellé qui servera à former
   * une url de redirection à partir de la modale choix de personne
   * @param value nouvelle valeur du libelle qui servera à former une url de redirection
   */
  setUrlSource(value: any){
    this.dataUrlExemplaireDePersonne = value
    if (value == "Exécuter" || value == "Historique des documents") {
      sessionStorage.setItem("urlSource", value)
    }
    
  }
  /**
   * Méthode permettant de recupérer la valeur au libellé qui servera à former
   * une url de redirection à partir de la modale choix de personne
   * @returns la valeur du libellé
   */
  getUrlSource(){
    this.dataUrlExemplaireDePersonne = sessionStorage.getItem("urlSource")
    return this.dataUrlExemplaireDePersonne
  }

  /**
   * Méthode permettant de stocker la personne sélectionnée dans la modale choix personne
   * @param nouvelle valeur
   */
  setExemplairePersonneRatachee(value: any){
    this.dataExemplairePersonneRatachee = value
    sessionStorage.setItem("personneRatachee",value.id);
  }
  /**
   * Méthode permettant de recupérer la personne stockée dans le setExemplairePersonneRatachee()
   * @returns la valeur de la personne
   */
  getExemplairePersonneRatachee(){
    this.dataExemplairePersonneRatachee = sessionStorage.getItem("personneRatachee")
    return this.dataExemplairePersonneRatachee
  }

}

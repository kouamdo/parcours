import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TypeMvt } from 'src/app/modele/type-mvt';
import { TypeValidation } from 'src/app/modele/type-validation';
import { FormatCode } from 'src/app/modele/format-code';

@Injectable({
  providedIn: 'root',
})
export class DonneesEchangeService {
  dataDocumentCategorie: any;
  dataDocumentPrecoMvts: any;
  dataDocumentAttributs: any;
  dataDocumentRessourcesAttributs : any;
  dataDocumentCodebarre: any;
  dataEtatSelectionner : any;
  dataDocumentSousDocuments: any;
  dataDocumentSousExemplaireDocuments: any;
  dataDocumentEtats: any;
  dataRoleValidation: any;
  dataEtapeDocuments: any;
  dataDocumentDocuments: any;
  dataExemplairePersonneRatachee: any;
  dataUrlExemplaireDePersonne: any;
  private _dataEnteteMenu: string = '';
  dataMouvementsExemplaire: any
  constructor(private http: HttpClient) {
    const storedDataEnteteMenu = sessionStorage.getItem('dataEnteteMenu');
    if (storedDataEnteteMenu) {
      this._dataEnteteMenu = storedDataEnteteMenu;
    } else {
      this._dataEnteteMenu = '';
    }
  }

  get dataEnteteMenu(): string {
    return this._dataEnteteMenu;
  }

  set dataEnteteMenu(value: string) {
    this._dataEnteteMenu = value;
    sessionStorage.setItem('dataEnteteMenu', value);
  }

  getTypeMvt(): Observable<TypeMvt> {
    return this.http.get<TypeMvt>('api/typeMvt');
  }

  getTypeValidation(): Observable<TypeValidation> {
    return this.http.get<TypeValidation>('api/typeValidation');
  }

  getFormatCode(): Observable<FormatCode> {
    return this.http.get<FormatCode>('api/formatCode');
  }

  saveEtatModal(value: any) {
    this.dataEtatSelectionner = value;
  }

  getsaveEtatModal(){
    return this.dataEtatSelectionner;
  }

  saveMouvementsExemplaire(value: any) {
    this.dataMouvementsExemplaire = value;
  }

  getMouvementsExemplaire(){
    return this.dataMouvementsExemplaire;
  }

  /**
   * Méthode permettant d'affecter une valeur au libellé qui servera à former
   * une url de redirection à partir de la modale choix de personne
   * @param value nouvelle valeur du libelle qui servera à former une url de redirection
   */
  setUrlSource(value: any) {
    this.dataUrlExemplaireDePersonne = value;
    if (value == 'Exécuter' || value == 'Historique des documents') {
      sessionStorage.setItem('urlSource', value);
    }
  }
  /**
   * Méthode permettant de recupérer la valeur au libellé qui servera à former
   * une url de redirection à partir de la modale choix de personne
   * @returns la valeur du libellé
   */
  getUrlSource() {
    this.dataUrlExemplaireDePersonne = sessionStorage.getItem('urlSource');
    return this.dataUrlExemplaireDePersonne;
  }

  /**
   * Méthode permettant de stocker la personne sélectionnée dans la modale choix personne
   * @param nouvelle valeur
   */
  setExemplairePersonneRatachee(value: any) {
    this.dataExemplairePersonneRatachee = value;
    sessionStorage.setItem('personneRatachee', value.id);
  }
  /**
   * Méthode permettant de recupérer la personne stockée dans le setExemplairePersonneRatachee()
   * @returns la valeur de la personne
   */
  getExemplairePersonneRatachee() {
    this.dataExemplairePersonneRatachee =
      sessionStorage.getItem('personneRatachee');
    return this.dataExemplairePersonneRatachee;
  }
}

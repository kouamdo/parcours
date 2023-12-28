import { Injectable } from '@angular/core';
import { IObjetDates } from 'src/app/modele/objet-dates';

@Injectable({
  providedIn: 'root'
})
export class VerificationsdatesrolesService {

  constructor() { }

  /**
   * Methode qui permet de comparer deux intervalles de dates en utilisant un objet éphemaire et de valider un
   * enregistrement fictif si les intervalles ne se chevauchent pas
   * @param ancienneDate objet déjà existant dans le système
   * @param nouvelleDate objet que l'on veut enregistrer dans le système
   * @returns 
   */
  OncheckedDatesRoles(ancienneDate : IObjetDates, nouvelleDate: IObjetDates):Boolean {

    let result: Boolean;

    result = false
    if (ancienneDate.dateFin || nouvelleDate.dateFin) {
      if (ancienneDate.dateDebut > ancienneDate.dateFin! || nouvelleDate.dateDebut > nouvelleDate.dateFin!) {
        result = false
      }  
    }

    // si l'objet existant ou le nouvel objet n'a pas de date de fin
    if (!ancienneDate.dateFin || !nouvelleDate.dateFin) {

      if (nouvelleDate.dateFin! <= ancienneDate.dateDebut && !ancienneDate.dateFin!) {
        result = true
      }
      else if (ancienneDate.dateFin! <= nouvelleDate.dateDebut && !nouvelleDate.dateFin) {
        result = true
      }

      // si la date de debut du nouvel objet commence après celle de l'objet existant
      if (ancienneDate.dateDebut < nouvelleDate.dateDebut && (!nouvelleDate.dateFin! && !ancienneDate.dateFin!)) {
        result = false
      }    
      else if (nouvelleDate.dateDebut <= ancienneDate.dateDebut && (!nouvelleDate.dateFin! && !ancienneDate.dateFin!)) { result = false}
    }
    else if (ancienneDate.dateDebut <= nouvelleDate.dateDebut && !ancienneDate.dateFin) {
      result = false
    }
    else if (ancienneDate.dateDebut <= nouvelleDate.dateDebut && nouvelleDate.dateDebut < ancienneDate.dateFin) {
      result = false
    }
    else if (nouvelleDate.dateDebut < ancienneDate.dateDebut && ancienneDate.dateDebut < nouvelleDate.dateFin) {
      result = false
    }
    else if (ancienneDate.dateDebut >= nouvelleDate.dateDebut) { // si la date de debut du nouvel objet commence avant celle de l'objet existant
 
      // si la date de fin du nouvel objet se termine avant la date de debut de l'ancien objet
      if (nouvelleDate.dateFin <= ancienneDate.dateDebut) {
          result = true
      }else{ // si la date de fin du nouvel objet se termine après la date de debut de l'ancien objet
        result = false
      }       
    }else if (ancienneDate.dateDebut <= nouvelleDate.dateDebut) { // si la date de debut du nouvel objet commence après celle de l'objet existant
      
      // si la date de debut du nouvel objet commence après la date de fin de l'objet existant
      if (ancienneDate.dateFin <= nouvelleDate.dateDebut) {
        result = true
      }
      else{ // si la date de fin du nouvel objet se termine après celle de l'objet existant
        result = false
      }
    }else {
      result = false
    }

    return result
  }
}

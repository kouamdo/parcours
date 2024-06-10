import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { IDistributeur } from 'src/app/modele/distributeur';
import { IFamille } from 'src/app/modele/famille';
import { IPrecoMvt } from 'src/app/modele/precomvt';
import { IPrecoMvtQte } from 'src/app/modele/precomvtqte';
import { PrecoMvtsService } from 'src/app/services/precomvts/precomvts.service';

@Component({
  selector: 'app-view-precomvt',
  templateUrl: './view-precomvt.component.html',
  styleUrls: ['./view-precomvt.component.scss']
})
export class ViewPrecomvtComponent implements OnInit {

  precoMvt:IPrecoMvt={
    id: '',
    etat:true,
    libelle:'',
     type: '',
    precomvtqte: [],
  }

  eltsPreco : IPrecoMvt[] = [];
  precomvtqte:IPrecoMvtQte[] = [];
 //element qui stocke les données contenant ressource et famille
  eltRessource:IPrecoMvtQte[]=[];
  eltFamille:IPrecoMvtQte[]=[];

  constructor(private router:Router, private infosPath:ActivatedRoute, private precoMvtService:PrecoMvtsService,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    let idPrecoMvt = this.data.idPrecoMvt
    if((idPrecoMvt != null) && idPrecoMvt!==''){
      this.precoMvtService.getPrecomvtById(idPrecoMvt).subscribe(
        x =>{
          this.precoMvt = x;
          this.precoMvt.precomvtqte.forEach(
            element => {
                   if (element.ressource != undefined && element.ressource != null ){

                     this.eltRessource.push(element)
                   }
                  else if (element.famille != null && element.famille.length>0 ){
                     this.eltFamille.push(element)
                 }
               }
              );
    });
      }

}
/**
 *
 * @param familles
 * @returns
 * fonction qui permet de concaténer le libelle de famille pour pouvoir l'afficher
 */
libelleCat(familles:IFamille[]):string{
    let listLibelleFamille:string=''
    familles.forEach(
      element => {
        listLibelleFamille += element.libelle + ', '
    });
    return listLibelleFamille
}
/**
 *
 * @param distributeurs
 * @returns
 * fonction qui permet de concaténer le libelle de distributeur pour pouvoir l'afficher
 */
distCat(distributeurs:IDistributeur[]):string{
  let listLibelleDistributeur:string=''
  if (distributeurs!= undefined)
  distributeurs.forEach(
    element => {
      listLibelleDistributeur += element.raisonSocial + ', '
  });
  return listLibelleDistributeur
}
}

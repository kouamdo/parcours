import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IPrecoMvt } from 'src/app/modele/precomvt';
import { IPrecoMvtQte } from 'src/app/modele/precomvtqte';
import { TypeMvt } from 'src/app/modele/type-mvt';
import { PrecoMvtsService } from 'src/app/services/precomvts/precomvts.service';

@Component({
  selector: 'app-view-precomvt',
  templateUrl: './view-precomvt.component.html',
  styleUrls: ['./view-precomvt.component.scss']
})
export class ViewPrecomvtComponent implements OnInit {

  PrecoMvt:IPrecoMvt={
    id: '',
    libelle:'',
   // type: '',
     type: TypeMvt.Ajout,
    etat:false,
    precomvtqte: [],

  }

  eltsPreco : IPrecoMvt[] = [];
  precomvtqte:IPrecoMvtQte[] = [];
 // idPrecoMvt: string = '';

  constructor(private router:Router, private infosPath:ActivatedRoute, private precoMvtService:PrecoMvtsService) {}

  ngOnInit(): void {
    let idPrecoMvt = this.infosPath.snapshot.paramMap.get('idPrecoMvt');
    console.log("idPrecoMvt :" + idPrecoMvt);
    if((idPrecoMvt != null) && idPrecoMvt!==''){
      this.precoMvtService.getPrecomvtById(idPrecoMvt).subscribe(
        x =>{
          this.PrecoMvt = x; console.log("Voici le precomvt", this.PrecoMvt);
          
          x.precomvtqte.forEach(
            element => {
                   let precoMvtTemp : IPrecoMvt ={
                     id: "",
                     libelle: "",
                     etat: true,
                       type: TypeMvt.Ajout,
                     precomvtqte:[]
                    };
                    precoMvtTemp.precomvtqte.push(element)
                   if (element.ressource != undefined && element.ressource != null ){
                     let rsrce  = " Ressource :  ";
                       const ressource = element.ressource!.libelle;
                       rsrce = rsrce + ressource

                     precoMvtTemp.libelle = rsrce
                     this.eltsPreco.push(precoMvtTemp)
                   }
                  else if (element.famille != null && element.famille.length>0 ){
                     let libel = "Familles : ";
                     for (let index = 0; index < element.famille!.length; index++) {
                       libel += element.famille![index].libelle;
                     }
                     precoMvtTemp.libelle = libel
                     this.eltsPreco.push(precoMvtTemp)
                 }
               }
              );
    });
      }

}

  supprimerElt(element:IPrecoMvtQte){
    this.PrecoMvt.precomvtqte.forEach((value, index) =>{
      if(value == element)
      this.PrecoMvt.precomvtqte.splice(index,1)
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IPrecoMvt } from 'src/app/modele/precomvt';
import { IPrecoMvtQte } from 'src/app/modele/precomvtqte';
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
    type: '',
    etat:false,
    precomvtqte:[],
  }
  eltsPreco : IPrecoMvt[] = [];
  precomvtqte:IPrecoMvtQte[] = [];

  constructor(private router:Router, private infosPath:ActivatedRoute, private precoMvtService:PrecoMvtsService) {}

  ngOnInit(): void {
    let idPrecoMvt = this.infosPath.snapshot.paramMap.get('idPrecoMvt');
    console.log("idPrecoMvt :" + idPrecoMvt);
    if((idPrecoMvt != null) && idPrecoMvt!==''){
      this.precoMvtService.getPrecomvtById(idPrecoMvt).subscribe(
        x =>{
          this.PrecoMvt = x;
          console.log("Voici le precomvt", this.PrecoMvt);
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

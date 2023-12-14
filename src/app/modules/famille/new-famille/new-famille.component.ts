import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, MaxLengthValidator,MinLengthValidator,ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EMPTY, Observable, isEmpty } from 'rxjs';
import { IService } from 'src/app/modele/service';
import { ServicesService } from 'src/app/services/services/services.service';
import { IFamille } from 'src/app/modele/famille';
import { FamillesService } from 'src/app/services/familles/familles.service';
import {v4 as uuidv4} from 'uuid';import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';




@Component({
  selector: 'app-new-famille',
  templateUrl: './new-famille.component.html',
  styleUrls: ['./new-famille.component.scss']
})
export class NewFamilleComponent implements OnInit {

  famille : IFamille|undefined;
  forme: FormGroup;
  btnLibelle: string="Ajouter";
  submitted: boolean=false;
  titre:string='';


  constructor(private formBuilder:FormBuilder, private familleService:FamillesService,private dataEnteteMenuService:DonneesEchangeService,private router:Router, private infosPath:ActivatedRoute, private datePipe: DatePipe) {
    this.forme =  this.formBuilder.group({
      libelle: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      etat: [true],

    })

  }

  ngOnInit() {
    let idFamille = this.infosPath.snapshot.paramMap.get('idFamille');
    if((idFamille != null) && idFamille!==''){

      this.btnLibelle="Envoyer";


      //trouver un autre moyen d'initialiser avec des valeurs
      this.familleService.getFamilleById(idFamille).subscribe(x =>
        {
          this.famille = x;
          this.forme.setValue({
            libelle: this.famille.libelle,
            description: this.famille.description,
            etat: this.famille.etat,

          })
        });
    }
    this.titre=this.dataEnteteMenuService.dataEnteteMenu
  }

  get f(){
    return this.forme.controls;
  }

  onSubmit(familleInput:any){
    this.submitted=true;
    //Todo la validation d'element non conforme passe
    if(this.forme.invalid) return;



    let familleTemp : IFamille={
      id: uuidv4(),
      libelle:familleInput.libelle,
      description:familleInput.description,
      etat:familleInput.etat,
    }

    if(this.famille != undefined){
      familleTemp.id = this.famille.id
    }
    this.familleService.ajouterFamille(familleTemp).subscribe(
      object => {
        this.router.navigate(['/list-familles']);
      }
    )



}
}
